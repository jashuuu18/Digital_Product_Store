
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/orders");

      setOrders(response.data.items || response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
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

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            My Orders
          </h2>

          <p className="text-gray-600 mt-1">
            View your order history and payment status.
          </p>
        </div>

        {/* Empty Orders */}
        {orders.length === 0 ? (

          <div className="bg-white rounded-xl shadow-md p-10 text-center">

            <div className="text-6xl mb-4">
              📦
            </div>

            <h3 className="text-2xl font-bold mb-2">
              No orders found
            </h3>

            <p className="text-gray-600 mb-6">
              You have not placed any orders yet.
            </p>

            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>

          </div>

        ) : (

          <div className="space-y-5">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-xl shadow-md p-6"
              >

                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">

                  <div>

                    <h3 className="text-xl font-bold">
                      Order #{order.id}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      Total: ₹{order.total_amount}
                    </p>

                    <p className="text-gray-500 text-sm mt-1">
                      {order.created_at
                        ? new Date(
                            order.created_at
                          ).toLocaleString()
                        : ""}
                    </p>

                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2">

                    <span
                      className={
                        order.status === "PAID"
                          ? "px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium"
                          : order.status === "FAILED"
                          ? "px-3 py-1 rounded-full bg-red-100 text-red-700 font-medium"
                          : "px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium"
                      }
                    >
                      {order.status}
                    </span>

                    <Link
                      to={"/orders/" + order.id}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default Orders;

