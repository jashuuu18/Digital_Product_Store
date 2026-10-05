
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.database import Base, get_db


# Separate database used only for testing
TEST_DATABASE_URL = "sqlite:///./test_store.db"

engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):

    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()


def create_user(client, email="test@example.com"):
    response = client.post(
        "/auth/register",
        json={
            "username": "testuser",
            "email": email,
            "password": "password123"
        }
    )

    assert response.status_code == 201
    return response.json()


def login_user(client, email="test@example.com"):
    response = client.post(
        "/auth/login",
        json={
            "email": email,
            "password": "password123"
        }
    )

    assert response.status_code == 200

    return response.json()["access_token"]


# =========================================================
# TEST 1 - ROOT API
# =========================================================

def test_root(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json()["message"] == "Digital Product Store API"


# =========================================================
# TEST 2 - HEALTH CHECK
# =========================================================

def test_health(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


# =========================================================
# TEST 3 - USER REGISTRATION
# =========================================================

def test_register_user(client):
    response = client.post(
        "/auth/register",
        json={
            "username": "jashwanth",
            "email": "jashu@gmail.com",
            "password": "password123"
        }
    )

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "jashwanth"
    assert data["email"] == "jashu@gmail.com"
    assert "id" in data


# =========================================================
# TEST 4 - DUPLICATE EMAIL
# =========================================================

def test_duplicate_email(client):
    create_user(client)

    response = client.post(
        "/auth/register",
        json={
            "username": "anotheruser",
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


# =========================================================
# TEST 5 - LOGIN
# =========================================================

def test_login(client):
    create_user(client)

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "password123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


# =========================================================
# TEST 6 - INVALID LOGIN
# =========================================================

def test_invalid_login(client):
    create_user(client)

    response = client.post(
        "/auth/login",
        json={
            "email": "test@example.com",
            "password": "wrongpassword"
        }
    )

    assert response.status_code == 401


# =========================================================
# TEST 7 - PROTECTED PROFILE
# =========================================================

def test_get_profile(client):
    create_user(client)

    token = login_user(client)

    response = client.get(
        "/auth/me",
        headers={
            "Authorization": f"Bearer {token}"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert data["email"] == "test@example.com"


# =========================================================
# TEST 8 - PROTECTED API WITHOUT TOKEN
# =========================================================

def test_profile_without_token(client):
    response = client.get("/auth/me")

    assert response.status_code == 401


# =========================================================
# TEST 9 - PRODUCT LIST
# =========================================================

def test_product_list(client):
    response = client.get("/products")

    assert response.status_code == 200

    data = response.json()

    assert "items" in data
    assert "page" in data
    assert "limit" in data
    assert "total" in data
    assert "total_pages" in data


# =========================================================
# TEST 10 - PRODUCT SEARCH
# =========================================================

def test_product_search(client):
    response = client.get(
        "/products?search=python"
    )

    assert response.status_code == 200

    data = response.json()

    assert "items" in data


# =========================================================
# TEST 11 - CART REQUIRES LOGIN
# =========================================================

def test_cart_requires_login(client):
    response = client.get("/cart")

    assert response.status_code == 401


# =========================================================
# TEST 12 - ORDERS REQUIRE LOGIN
# =========================================================

def test_orders_require_login(client):
    response = client.get("/orders")

    assert response.status_code == 401

