
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/orders", {
        params: {
          page,
          limit,
        },
      });

      setOrders(response.data.items);
      setTotalPages(response.data.total_pages);
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
  }, [page]);

  const getStatusClass = (status) => {
    if (status === "PAID") {
      return "bg-green-100 text-green-700";
    }

    if (status === "FAILED") {
      return "bg-red-100 text-red-700";
    }

    if (status === "CANCELLED") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-6">

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Orders
          </h1>

          <p className="text-gray-600 mt-1">
            View and monitor all customer orders
          </p>

        </div>

        {/* ORDERS */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-xl font-bold">
              All Orders
            </h2>

          </div>

          {loading ? (

            <div className="p-10 text-center">
              Loading orders...
            </div>

          ) : orders.length === 0 ? (

            <div className="p-10 text-center text-gray-500">
              No orders found.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left p-4">
                      Order ID
                    </th>

                    <th className="text-left p-4">
                      User ID
                    </th>

                    <th className="text-left p-4">
                      Total
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Date
                    </th>

                    <th className="text-left p-4">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {orders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-t"
                    >

                      <td className="p-4 font-semibold">
                        #{order.id}
                      </td>

                      <td className="p-4">
                        {order.user_id}
                      </td>

                      <td className="p-4 font-medium">
                        ₹{order.total_amount}
                      </td>

                      <td className="p-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>

                      <td className="p-4 text-gray-600">
                        {order.created_at
                          ? new Date(
                              order.created_at
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td className="p-4">

                        <Link
                          to={`/orders/${order.id}`}
                          className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                        >
                          View
                        </Link>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          {/* PAGINATION */}

          <div className="flex items-center justify-center gap-4 p-5 border-t">

            <button
              disabled={page === 1}
              onClick={() =>
                setPage((current) => current - 1)
              }
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() =>
                setPage((current) => current + 1)
              }
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminOrders;

