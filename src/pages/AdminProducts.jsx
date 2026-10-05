
import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function AdminProducts() {
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    is_active: true,
  });

  // ==========================================
  // GET ADMIN PRODUCTS
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/products", {
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
        error.response?.data?.detail ||
          "Failed to load products"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  // ==========================================
  // FORM INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ==========================================
  // OPEN ADD FORM
  // ==========================================

  const openAddForm = () => {
    setEditingProduct(null);

    setFormData({
      name: "",
      description: "",
      price: "",
      image_url: "",
      is_active: true,
    });

    setShowForm(true);
  };

  // ==========================================
  // OPEN EDIT FORM
  // ==========================================

  const openEditForm = (product) => {
    setEditingProduct(product);

    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url || "",
      is_active: product.is_active,
    });

    setShowForm(true);
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        image_url: formData.image_url || null,
        is_active: formData.is_active,
      };

      if (editingProduct) {
        await api.put(
          `/admin/products/${editingProduct.id}`,
          payload
        );

        toast.success("Product updated successfully");
      } else {
        await api.post(
          "/admin/products",
          payload
        );

        toast.success("Product created successfully");
      }

      setShowForm(false);
      setEditingProduct(null);

      setFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        is_active: true,
      });

      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Operation failed"
      );
    }
  };

  // ==========================================
  // DEACTIVATE PRODUCT
  // ==========================================

  const deactivateProduct = async (productId) => {
    try {
      await api.delete(
        `/admin/products/${productId}`
      );

      toast.success(
        "Product deactivated successfully"
      );

      fetchProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to deactivate product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Admin Products
            </h1>

            <p className="text-gray-600 mt-1">
              Manage your digital products
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>

        </div>

        {/* SEARCH */}

        <div className="bg-white p-4 rounded-lg shadow mb-6">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* ADD / EDIT FORM */}

        {showForm && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">

            <h2 className="text-xl font-bold mb-5">
              {editingProduct
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>
                <label className="block font-medium mb-1">
                  Product Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Price
                </label>

                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block font-medium mb-1">
                  Image URL
                </label>

                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <label className="flex items-center gap-2">

                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                />

                <span>Active Product</span>

              </label>

              <div className="flex gap-3">

                <button
                  type="submit"
                  className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700"
                >
                  {editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="bg-gray-300 text-gray-800 px-5 py-3 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {/* PRODUCTS */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="p-5 border-b">

            <h2 className="text-xl font-bold">
              Product List
            </h2>

          </div>

          {loading ? (
            <div className="p-10 text-center">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No products found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full">

                <thead className="bg-gray-50">

                  <tr>

                    <th className="text-left p-4">
                      ID
                    </th>

                    <th className="text-left p-4">
                      Product
                    </th>

                    <th className="text-left p-4">
                      Price
                    </th>

                    <th className="text-left p-4">
                      Status
                    </th>

                    <th className="text-left p-4">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr
                      key={product.id}
                      className="border-t"
                    >

                      <td className="p-4">
                        {product.id}
                      </td>

                      <td className="p-4">

                        <div className="font-semibold">
                          {product.name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {product.description}
                        </div>

                      </td>

                      <td className="p-4">
                        ₹{product.price}
                      </td>

                      <td className="p-4">

                        {product.is_active ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            Active
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                            Inactive
                          </span>
                        )}

                      </td>

                      <td className="p-4">

                        <div className="flex gap-2">

                          <button
                            onClick={() =>
                              openEditForm(product)
                            }
                            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          {product.is_active && (
                            <button
                              onClick={() =>
                                deactivateProduct(
                                  product.id
                                )
                              }
                              className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                            >
                              Deactivate
                            </button>
                          )}

                        </div>

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

export default AdminProducts;

