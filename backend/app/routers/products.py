import math

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query
)

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Product
from app.schemas import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse
)
from app.dependencies import require_admin


router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.get(
    "",
    response_model=ProductListResponse
)
def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = "",
    db: Session = Depends(get_db)
):

    query = db.query(Product).filter(
        Product.is_active == True
    )

    if search:

        query = query.filter(
            Product.name.ilike(
                f"%{search}%"
            )
        )

    total = query.count()

    products = query.offset(
        (page - 1) * limit
    ).limit(limit).all()

    total_pages = math.ceil(
        total / limit
    ) if total else 0

    return {
        "items": products,
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": total_pages
    }


@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):

    product = db.query(Product).filter(
        Product.id == product_id,
        Product.is_active == True
    ).first()

    if not product:

        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.post(
    "",
    response_model=ProductResponse,
    status_code=201
)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin)
):

    product = Product(
        **data.model_dump()
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
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

    for key, value in data.model_dump(
        exclude_unset=True
    ).items():

        setattr(product, key, value)

    db.commit()
    db.refresh(product)

    return product


@router.delete(
    "/{product_id}"
)
def delete_product(
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
        "message": "Product deleted successfully"
    }