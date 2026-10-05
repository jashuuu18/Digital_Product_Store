
import { Link } from "react-router-dom";

function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="bg-white rounded-xl shadow-md p-10 text-center max-w-md w-full">

        <div className="text-6xl mb-5">
          ✅
        </div>

        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful
        </h1>

        <p className="text-gray-600 mb-8">
          Your payment has been submitted successfully.
          Your order status will be updated after Stripe
          confirms the payment through the webhook.
        </p>

        <div className="flex flex-col gap-3">

          <Link
            to="/orders"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
          >
            View My Orders
          </Link>

          <Link
            to="/products"
            className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300"
          >
            Continue Shopping
          </Link>

        </div>

      </div>

    </div>
  );
}

export default PaymentSuccess;

