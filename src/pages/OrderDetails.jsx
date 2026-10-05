
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/orders/" + orderId
      );

      setOrder(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to load order"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">
          Loading order...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">

        <h2 className="text-2xl font-bold mb-4">
          Order not found
        </h2>

        <Link
          to="/orders"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Orders
        </Link>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <header className="bg-blue-600 text-white px-6 py-4">

        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Digital Product Store
          </h1>

          <nav className="flex gap-4">

            <Link
              to="/products"
              className="hover:underline"
            >
              Products
            </Link>

            <Link
              to="/cart"
              className="hover:underline"
            >
              Cart
            </Link>

            <Link
              to="/orders"
              className="font-bold"
            >
              Orders
            </Link>

          </nav>

        </div>

      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">

        <Link
          to="/orders"
          className="text-blue-600 hover:underline"
        >
          ← Back to Orders
        </Link>

        <div className="bg-white rounded-xl shadow-md mt-6 p-8">

          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">

            <div>

              <h2 className="text-3xl font-bold">
                Order #{order.id}
              </h2>

              <p className="text-gray-500 mt-2">
                {order.created_at
                  ? new Date(
                      order.created_at
                    ).toLocaleString()
                  : ""}
              </p>

            </div>

            <span
              className={
                order.status === "PAID"
                  ? "px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold"
                  : order.status === "FAILED"
                  ? "px-4 py-2 rounded-full bg-red-100 text-red-700 font-bold"
                  : "px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-bold"
              }
            >
              {order.status}
            </span>

          </div>

          <div className="border-t pt-6">

            <h3 className="text-xl font-bold mb-4">
              Order Items
            </h3>

            {order.items &&
              order.items.map((item) => (

                <div
                  key={item.id}
                  className="flex justify-between items-center border-b py-4"
                >

                  <div>

                    <p className="font-semibold">
                      {item.product_name}
                    </p>

                    <p className="text-gray-500">
                      ₹{item.price} × {item.quantity}
                    </p>

                  </div>

                  <p className="font-bold">
                    ₹{item.price * item.quantity}
                  </p>

                </div>

              ))}

          </div>

          <div className="flex justify-between text-xl font-bold border-t mt-6 pt-6">

            <span>
              Total
            </span>

            <span className="text-blue-600">
              ₹{order.total_amount}
            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default OrderDetails;

