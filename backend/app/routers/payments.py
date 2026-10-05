import os

import stripe

from dotenv import load_dotenv

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Request,
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    User,
    Cart,
    Order,
    OrderItem,
    Payment,
)
from app.schemas import CheckoutResponse
from app.dependencies import get_current_user


# Load environment variables
load_dotenv()


# Stripe configuration
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")
FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


# Make sure Stripe secret key exists
if not STRIPE_SECRET_KEY:
    raise RuntimeError(
        "STRIPE_SECRET_KEY is not configured in .env"
    )


# Configure Stripe
stripe.api_key = STRIPE_SECRET_KEY


router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


# ============================================================
# CREATE STRIPE CHECKOUT SESSION
# ============================================================

@router.post(
    "/create-checkout-session",
    response_model=CheckoutResponse
)
def create_checkout_session(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    # Get current user's cart
    cart = db.query(Cart).filter(
        Cart.user_id == current_user.id
    ).first()

    # Check whether cart exists
    if not cart or not cart.items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty"
        )

    total = 0

    # Create pending order
    order = Order(
        user_id=current_user.id,
        total_amount=0,
        status="PENDING"
    )

    db.add(order)
    db.flush()

    line_items = []

    # Convert cart items into order items
    for cart_item in cart.items:

        product = cart_item.product

        # Make sure product is still active
        if not product.is_active:
            db.rollback()

            raise HTTPException(
                status_code=400,
                detail=(
                    f"Product '{product.name}' "
                    "is no longer available"
                )
            )

        subtotal = (
            product.price *
            cart_item.quantity
        )

        total += subtotal

        # Save product information in order
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=cart_item.quantity,
            price=product.price
        )

        db.add(order_item)

        # Stripe line item
        line_items.append(
            {
                "price_data": {
                    "currency": "inr",
                    "product_data": {
                        "name": product.name
                    },
                    "unit_amount": int(
                        round(product.price * 100)
                    ),
                },
                "quantity": cart_item.quantity,
            }
        )

    # Set final order total
    order.total_amount = total

    # Create pending payment
    payment = Payment(
        order_id=order.id,
        amount=total,
        status="PENDING"
    )

    db.add(payment)

    # Save order/payment before Stripe request
    db.commit()
    db.refresh(order)

    try:

        # Create Stripe Checkout Session
        checkout_session = stripe.checkout.Session.create(

            
            line_items=line_items,

            mode="payment",

            success_url=(
                f"{FRONTEND_URL}/payment-success"
            ),

            cancel_url=(
                f"{FRONTEND_URL}/cart"
            ),

            customer_email=current_user.email,

            metadata={
                "order_id": str(order.id),
                "user_id": str(current_user.id),
            },
        )

        # Store Stripe session ID
        order.stripe_session_id = (
            checkout_session.id
        )

        db.commit()

        return {
            "checkout_url": checkout_session.url,
            "order_id": order.id,
        }

    except stripe.error.StripeError as e:

        # Remove pending order if Stripe fails
        db.delete(order)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail=f"Stripe error: {str(e)}"
        )

    except Exception as e:

        # Remove pending order if another error occurs
        db.delete(order)
        db.commit()

        raise HTTPException(
            status_code=500,
            detail=f"Payment processing error: {str(e)}"
        )


# ============================================================
# STRIPE WEBHOOK
# ============================================================

@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):

    # Webhook secret must exist
    if not STRIPE_WEBHOOK_SECRET:

        raise HTTPException(
            status_code=500,
            detail=(
                "STRIPE_WEBHOOK_SECRET "
                "is not configured"
            )
        )

    # Read raw request body
    payload = await request.body()

    # Stripe signature
    signature = request.headers.get(
        "stripe-signature"
    )

    if not signature:

        raise HTTPException(
            status_code=400,
            detail="Missing Stripe signature"
        )

    # Verify Stripe webhook
    try:

        event = stripe.Webhook.construct_event(
            payload,
            signature,
            STRIPE_WEBHOOK_SECRET
        )

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail="Invalid webhook payload"
        )

    except stripe.error.SignatureVerificationError:

        raise HTTPException(
            status_code=400,
            detail="Invalid webhook signature"
        )

    # ========================================================
    # PAYMENT SUCCESS
    # ========================================================

    if event["type"] == "checkout.session.completed":

        session = event["data"]["object"]

        metadata = session.get("metadata", {})

        order_id = metadata.get("order_id")

        if not order_id:

            return {
                "received": True
            }

        order = db.query(Order).filter(
            Order.id == int(order_id)
        ).first()

        if order:

            # Update order status
            order.status = "PAID"

            # Update payment status
            if order.payment:

                order.payment.status = "PAID"

                order.payment.stripe_payment_intent_id = (
                    session.get("payment_intent")
                )

            # Clear user's cart
            cart = db.query(Cart).filter(
                Cart.user_id == order.user_id
            ).first()

            if cart:

                for item in list(cart.items):

                    db.delete(item)

            db.commit()

    # ========================================================
    # PAYMENT FAILED
    # ========================================================

    elif event["type"] == (
        "checkout.session.async_payment_failed"
    ):

        session = event["data"]["object"]

        metadata = session.get("metadata", {})

        order_id = metadata.get("order_id")

        if not order_id:

            return {
                "received": True
            }

        order = db.query(Order).filter(
            Order.id == int(order_id)
        ).first()

        if order:

            # Update order
            order.status = "FAILED"

            # Update payment
            if order.payment:

                order.payment.status = "FAILED"

            db.commit()

    # ========================================================
    # OTHER EVENTS
    # ========================================================

    return {
        "received": True
    }
