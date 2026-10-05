
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import (
    Product,
    Order,
    Payment,
    OrderItem
)
from app.schemas import (
    AdminStats,
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse
)
from app.dependencies import require_admin


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# =========================================================
# ADMIN PRODUCT MANAGEMENT
# =========================================================

@router.get(
    "/products",
    response_model=ProductListResponse
)
def get_admin_products(
    page: int = 1,
    limit: int = 10,
    search: str = "",
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    if page < 1:
        raise HTTPException(
            status_code=400,
            detail="Page must be greater than 0"
        )

    if limit < 1 or limit > 100:
        raise HTTPException(
            status_code=400,
            detail="Limit must be between 1 and 100"
        )

    query = db.query(Product)

    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%")
        )

    total = query.count()

    offset = (page - 1) * limit

    products = query.order_by(
        Product.id.desc()
    ).offset(offset).limit(limit).all()

    total_pages = (
        (total + limit - 1) // limit
        if total > 0
        else 0
    )

    return {
        "items": products,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }


@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED
)
def create_admin_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    product = Product(
        name=data.name,
        description=data.description,
        price=data.price,
        image_url=data.image_url,
        is_active=data.is_active
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.put(
    "/products/{product_id}",
    response_model=ProductResponse
)
def update_admin_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    update_data = data.model_dump(
        exclude_unset=True
    )

    for field, value in update_data.items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)

    return product


@router.delete(
    "/products/{product_id}"
)
def deactivate_admin_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    product = db.query(Product).filter(
        Product.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.is_active = False

    db.commit()

    return {
        "message": "Product deactivated successfully",
        "product_id": product.id
    }


# =========================================================
# ADMIN DASHBOARD STATISTICS
# =========================================================

@router.get(
    "/stats",
    response_model=AdminStats
)
def get_stats(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    total_products = db.query(
        Product
    ).filter(
        Product.is_active == True
    ).count()

    total_orders = db.query(
        Order
    ).count()

    paid_orders = db.query(
        Order
    ).filter(
        Order.status == "PAID"
    ).count()

    total_revenue = db.query(
        func.coalesce(
            func.sum(Order.total_amount),
            0
        )
    ).filter(
        Order.status == "PAID"
    ).scalar()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "paid_orders": paid_orders,
        "total_revenue": total_revenue
    }


# =========================================================
# ADMIN REPORTS
# =========================================================

@router.get(
    "/reports/revenue"
)
def total_revenue(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    revenue = db.query(
        func.coalesce(
            func.sum(Order.total_amount),
            0
        )
    ).filter(
        Order.status == "PAID"
    ).scalar()

    return {
        "total_revenue": revenue
    }


@router.get(
    "/reports/most-purchased"
)
def most_purchased_products(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    rows = db.query(
        Product.name,
        func.sum(
            OrderItem.quantity
        ).label("total_quantity")
    ).join(
        OrderItem,
        Product.id == OrderItem.product_id
    ).join(
        Order,
        Order.id == OrderItem.order_id
    ).filter(
        Order.status == "PAID"
    ).group_by(
        Product.id
    ).order_by(
        func.sum(
            OrderItem.quantity
        ).desc()
    ).all()

    return [
        {
            "product": row.name,
            "quantity": row.total_quantity
        }
        for row in rows
    ]


@router.get(
    "/reports/orders-per-user"
)
def orders_per_user(
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):
    from app.models import User

    rows = db.query(
        User.email,
        func.count(
            Order.id
        ).label("order_count")
    ).join(
        Order,
        User.id == Order.user_id
    ).group_by(
        User.id
    ).all()

    return [
        {
            "email": row.email,
            "orders": row.order_count
        }
        for row in rows
    ]

