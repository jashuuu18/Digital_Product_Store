from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import (
    Cart,
    CartItem,
    Product,
    User
)
from app.schemas import (
    CartItemCreate,
    CartItemUpdate,
    CartResponse
)
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)


def build_cart_response(cart):

    items = []

    total = 0

    for item in cart.items:

        subtotal = (
            item.product.price *
            item.quantity
        )

        total += subtotal

        items.append({
            "id": item.id,
            "product_id": item.product_id,
            "product_name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "subtotal": subtotal
        })

    return {
        "items": items,
        "total_amount": total
    }


def get_user_cart(
    user: User,
    db: Session
):

    cart = db.query(Cart).filter(
        Cart.user_id == user.id
    ).first()

    if not cart:

        cart = Cart(
            user_id=user.id
        )

        db.add(cart)
        db.commit()
        db.refresh(cart)

    return cart


@router.get(
    "",
    response_model=CartResponse
)
def get_cart(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    cart = get_user_cart(
        current_user,
        db
    )

    return build_cart_response(cart)


@router.post(
    "/items"
)
def add_to_cart(
    data: CartItemCreate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == data.product_id,
        Product.is_active == True
    ).first()

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    cart = get_user_cart(
        current_user,
        db
    )

    existing = db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == data.product_id
    ).first()

    if existing:

        existing.quantity += data.quantity

    else:

        item = CartItem(
            cart_id=cart.id,
            product_id=data.product_id,
            quantity=data.quantity
        )

        db.add(item)

    db.commit()

    return {
        "message": "Product added to cart"
    }


@router.put(
    "/items/{item_id}"
)
def update_cart_item(
    item_id: int,
    data: CartItemUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    cart = get_user_cart(
        current_user,
        db
    )

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    item.quantity = data.quantity

    db.commit()

    return {
        "message": "Cart updated"
    }


@router.delete(
    "/items/{item_id}"
)
def remove_cart_item(
    item_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    cart = get_user_cart(
        current_user,
        db
    )

    item = db.query(CartItem).filter(
        CartItem.id == item_id,
        CartItem.cart_id == cart.id
    ).first()

    if not item:

        raise HTTPException(
            status_code=404,
            detail="Cart item not found"
        )

    db.delete(item)
    db.commit()

    return {
        "message": "Product removed"
    }


@router.delete(
    ""
)
def clear_cart(
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db)
):

    cart = get_user_cart(
        current_user,
        db
    )

    for item in cart.items:

        db.delete(item)

    db.commit()

    return {
        "message": "Cart cleared"
    }