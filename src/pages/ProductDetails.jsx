import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function ProductDetails() {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const response = await api.get(`/products/${productId}`);

      setProduct(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    try {
      await api.post("/cart/items", {
        product_id: product.id,
        quantity: quantity,
      });

      toast.success("Product added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to add product to cart"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">
          Product not found
        </h2>

        <Link
          to="/products"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          Back to Products
        </Link>
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
              className="hover:underline"
            >
              Orders
            </Link>
          </nav>

        </div>
      </header>

      {/* Product */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        <Link
          to="/products"
          className="text-blue-600 hover:underline"
        >
          ← Back to Products
        </Link>

        <div className="bg-white rounded-xl shadow-md mt-6 p-8">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Product Image */}
            <div className="h-80 bg-blue-100 rounded-xl flex items-center justify-center">

              <span className="text-8xl">
                📚
              </span>

            </div>

            {/* Product Information */}
            <div>

              <h2 className="text-3xl font-bold mb-4">
                {product.name}
              </h2>

              <p className="text-gray-600 text-lg mb-6">
                {product.description}
              </p>

              <p className="text-3xl font-bold text-blue-600 mb-6">
                ₹{product.price}
              </p>

              {/* Quantity */}
              <div className="mb-6">

                <p className="font-medium mb-2">
                  Quantity
                </p>

                <div className="flex items-center gap-3">

                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 bg-gray-200 rounded-lg text-xl"
                  >
                    -
                  </button>

                  <span className="text-xl font-bold">
                    {quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 bg-gray-200 rounded-lg text-xl"
                  >
                    +
                  </button>

                </div>

              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700"
              >
                Add to Cart
              </button>

            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

export default ProductDetails;