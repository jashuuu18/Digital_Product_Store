# Digital_Product_Store


## Technologies

### Backend
- FastAPI
- Python
- SQLAlchemy
- SQLite
- JWT
- Pytest

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Toastify

### Payment
- Stripe Checkout
- Stripe Webhooks

## Project Structure

digital_product_store/
├── backend/
└── frontend/

## Backend Setup

cd backend

python -m venv venv

.\venv\Scripts\Activate.ps1

pip install -r requirements.txt

## Environment Variables

DATABASE_URL=sqlite:///./store.db
SECRET_KEY=your-secret-key
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
FRONTEND_URL=http://localhost:5173

## Run Backend

uvicorn app.main:app --reload

## Swagger

http://127.0.0.1:8000/docs

## Frontend Setup

cd frontend

npm install

npm run dev

## Frontend

http://localhost:5173

## Stripe Webhook

stripe listen --forward-to localhost:8000/payments/webhook

## Testing

python -m pytest -v
