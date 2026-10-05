from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Cart
from app.schemas import (
    RegisterRequest,
    LoginRequest,
    TokenResponse,
    UserResponse
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    existing_user = db.query(User).filter(
        User.email == data.email
    ).first()

    if existing_user:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(
            data.password
        ),
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    cart = Cart(
        user_id=user.id
    )

    db.add(cart)
    db.commit()

    return user


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(User).filter(
        User.email == data.email
    ).first()

    if not user or not verify_password(
        data.password,
        user.hashed_password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": str(user.id)
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_profile(
    current_user: User = Depends(
        get_current_user
    )
):

    return current_user