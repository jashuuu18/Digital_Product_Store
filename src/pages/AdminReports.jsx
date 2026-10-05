
import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminReports() {
  const [revenue, setRevenue] = useState(0);
  const [mostPurchased, setMostPurchased] = useState([]);
  const [ordersPerUser, setOrdersPerUser] = useState([]);

  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH REPORTS
  // ==========================================

  const fetchReports = async () => {
    try {
      setLoading(true);

      const [
        revenueResponse,
        purchasedResponse,
        userOrdersResponse,
      ] = await Promise.all([
        api.get("/admin/reports/revenue"),
        api.get("/admin/reports/most-purchased"),
        api.get("/admin/reports/orders-per-user"),
      ]);

      setRevenue(
        revenueResponse.data.total_revenue
      );

      setMostPurchased(
        purchasedResponse.data
      );

      setOrdersPerUser(
        userOrdersResponse.data
      );

    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div className="text-center">

          <div className="text-4xl mb-4">
            📊
          </div>

          <p className="text-gray-600">
            Loading reports...
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800">
            Admin Reports
          </h1>

          <p className="text-gray-600 mt-1">
            Analyze store sales and customer activity
          </p>

        </div>

        {/* REVENUE */}

        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-500">
                Total Revenue
              </p>

              <h2 className="text-4xl font-bold text-green-600 mt-2">
                ₹{revenue}
              </h2>

            </div>

            <div className="text-5xl">
              💰
            </div>

          </div>

        </div>

        {/* REPORT TABLES */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* MOST PURCHASED */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="p-5 border-b">

              <h2 className="text-xl font-bold text-gray-800">
                Most Purchased Products
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Products purchased in paid orders
              </p>

            </div>

            {mostPurchased.length === 0 ? (

              <div className="p-8 text-center text-gray-500">
                No purchase data available.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left p-4">
                        Product
                      </th>

                      <th className="text-right p-4">
                        Quantity
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {mostPurchased.map(
                      (item, index) => (

                        <tr
                          key={index}
                          className="border-t"
                        >

                          <td className="p-4">
                            {item.product}
                          </td>

                          <td className="p-4 text-right font-semibold">
                            {item.quantity}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

          {/* ORDERS PER USER */}

          <div className="bg-white rounded-xl shadow overflow-hidden">

            <div className="p-5 border-b">

              <h2 className="text-xl font-bold text-gray-800">
                Orders Per User
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Number of orders placed by each user
              </p>

            </div>

            {ordersPerUser.length === 0 ? (

              <div className="p-8 text-center text-gray-500">
                No order data available.
              </div>

            ) : (

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-gray-50">

                    <tr>

                      <th className="text-left p-4">
                        Email
                      </th>

                      <th className="text-right p-4">
                        Orders
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {ordersPerUser.map(
                      (item, index) => (

                        <tr
                          key={index}
                          className="border-t"
                        >

                          <td className="p-4">
                            {item.email}
                          </td>

                          <td className="p-4 text-right font-semibold">
                            {item.orders}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminReports;

