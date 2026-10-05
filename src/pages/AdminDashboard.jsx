
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    paid_orders: 0,
    total_revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/stats");

      setStats(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-lg text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <p className="text-gray-600 mt-1">
            Manage your digital product store
          </p>

        </div>

        {/* STAT CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

          {/* TOTAL PRODUCTS */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Products
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.total_products}
                </h2>
              </div>

              <div className="text-4xl">
                📦
              </div>

            </div>

          </div>

          {/* TOTAL ORDERS */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Orders
                </p>

                <h2 className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.total_orders}
                </h2>
              </div>

              <div className="text-4xl">
                🛒
              </div>

            </div>

          </div>

          {/* PAID ORDERS */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Paid Orders
                </p>

                <h2 className="text-3xl font-bold text-green-600 mt-2">
                  {stats.paid_orders}
                </h2>
              </div>

              <div className="text-4xl">
                ✅
              </div>

            </div>

          </div>

          {/* REVENUE */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-gray-500 text-sm">
                  Total Revenue
                </p>

                <h2 className="text-3xl font-bold text-blue-600 mt-2">
                  ₹{stats.total_revenue}
                </h2>
              </div>

              <div className="text-4xl">
                💰
              </div>

            </div>

          </div>

        </div>

        {/* ADMIN MENU */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PRODUCTS */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Product Management
            </h2>

            <p className="text-gray-600 mb-5">
              Create, update, search and deactivate
              digital products.
            </p>

            <Link
              to="/admin/products"
              className="inline-block bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Manage Products
            </Link>

          </div>

          {/* ORDERS */}

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Order Management
            </h2>

            <p className="text-gray-600 mb-5">
              View customer orders and payment
              statuses.
            </p>

            <Link
              to="/admin/orders"
              className="inline-block bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
            >
              Manage Orders
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;

