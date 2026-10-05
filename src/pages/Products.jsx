import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(6);

  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/products", {
        params: {
          page,
          limit,
          search,
        },
      });

      setProducts(response.data.items);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <header className="bg-blue-600 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">

          <h1 className="text-2xl font-bold">
            Digital Product Store
          </h1>

          <nav className="flex gap-4">
            <Link to="/products" className="hover:underline">
              Products
            </Link>

            <Link to="/cart" className="hover:underline">
              Cart
            </Link>

            <Link to="/orders" className="hover:underline">
              Orders
            </Link>
          </nav>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              Digital Products
            </h2>

            <p className="text-gray-600 mt-1">
              Learn and improve your skills with our courses.
            </p>
          </div>

          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products..."
            className="border rounded-lg px-4 py-2 w-full md:w-80"
          />

        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-10">
            <p className="text-lg">Loading products...</p>
          </div>
        )}

        {/* Products */}
        {!loading && products.length === 0 && (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              No products found.
            </p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >

                <div className="h-40 bg-blue-100 flex items-center justify-center">
                  <span className="text-5xl">
                    📚
                  </span>
                </div>

                <div className="p-5">

                  <h3 className="text-xl font-bold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-gray-600 mb-4">
                    {product.description}
                  </p>

                  <div className="flex justify-between items-center">

                    <span className="text-2xl font-bold text-blue-600">
                      ₹{product.price}
                    </span>

                    <Link
                      to={`/products/${product.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">

            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>

            <span className="font-medium">
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              Next
            </button>

          </div>
        )}

      </main>
    </div>
  );
}

export default Products;