
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field


# ============================================================
# AUTHENTICATION
# ============================================================

class RegisterRequest(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=50
    )
    email: EmailStr
    password: str = Field(
        ...,
        min_length=6
    )


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    role: str
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================================
# PRODUCTS
# ============================================================

class ProductCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=200
    )

    description: str = Field(
        ...,
        min_length=2
    )

    price: float = Field(
        ...,
        gt=0
    )

    image_url: Optional[str] = None

    is_active: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(
        None,
        min_length=2,
        max_length=200
    )

    description: Optional[str] = Field(
        None,
        min_length=2
    )

    price: Optional[float] = Field(
        None,
        gt=0
    )

    image_url: Optional[str] = None

    is_active: Optional[bool] = None


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image_url: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    page: int
    limit: int
    total: int
    total_pages: int


# ============================================================
# CART
# ============================================================

class CartItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(
        ...,
        gt=0
    )


class CartItemUpdate(BaseModel):
    quantity: int = Field(
        ...,
        gt=0
    )


class CartItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    price: float
    quantity: int
    subtotal: float


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    total_amount: float


# ============================================================
# ORDERS
# ============================================================

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: float

    class Config:
        from_attributes = True


class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    stripe_session_id: Optional[str]
    created_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    page: int
    limit: int
    total: int
    total_pages: int


# ============================================================
# PAYMENT / STRIPE
# ============================================================

class CheckoutResponse(BaseModel):
    checkout_url: str
    order_id: int


# ============================================================
# ADMIN
# ============================================================

class AdminStats(BaseModel):
    total_products: int
    total_orders: int
    paid_orders: int
    total_revenue: float

