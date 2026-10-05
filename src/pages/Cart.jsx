
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchCart = async () => {
    try {
      setLoading(true);

      const response = await api.get("/cart");

      setCart(response.data);
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to load cart"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      await api.put(
        "/cart/items/" + itemId,
        {
          quantity: quantity,
        }
      );

      await fetchCart();

      toast.success("Cart updated");
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to update quantity"
      );
    }
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(
        "/cart/items/" + itemId
      );

      toast.success("Item removed from cart");

      await fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to remove item"
      );
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");

      toast.success("Cart cleared");

      await fetchCart();
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to clear cart"
      );
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);

      const response = await api.post(
        "/payments/create-checkout-session"
      );

      const checkoutUrl =
        response.data.checkout_url;

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error(
          "Checkout URL was not returned"
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail ||
          "Failed to create checkout session"
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">
          Loading cart...
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
              className="font-bold"
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

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-10">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h2 className="text-3xl font-bold">
              My Cart
            </h2>

            <p className="text-gray-600 mt-1">
              Review your selected digital products.
            </p>
          </div>

          {cart?.items?.length > 0 && (
            <button
              onClick={clearCart}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Clear Cart
            </button>
          )}

        </div>

        {/* Empty Cart */}
        {!cart?.items ||
        cart.items.length === 0 ? (

          <div className="bg-white rounded-xl shadow-md p-10 text-center">

            <div className="text-6xl mb-4">
              🛒
            </div>

            <h3 className="text-2xl font-bold mb-2">
              Your cart is empty
            </h3>

            <p className="text-gray-600 mb-6">
              Add some products to your cart.
            </p>

            <Link
              to="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Browse Products
            </Link>

          </div>

        ) : (

          <div className="space-y-6">

            {/* Cart Items */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">

              {cart.items.map((item) => (

                <div
                  key={item.id}
                  className="border-b last:border-b-0 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
                >

                  {/* Product */}
                  <div className="flex-1">

                    <h3 className="text-xl font-bold">
                      {item.product_name}
                    </h3>

                    <p className="text-gray-600 mt-1">
                      ₹{item.price} each
                    </p>

                  </div>

                  {/* Quantity */}
                  <div>

                    <p className="text-sm text-gray-500 mb-2">
                      Quantity
                    </p>

                    <div className="flex items-center gap-3">

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={
                          item.quantity <= 1
                        }
                        className="w-9 h-9 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300"
                      >
                        -
                      </button>

                      <span className="font-bold text-lg min-w-[25px] text-center">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        className="w-9 h-9 bg-gray-200 rounded-lg hover:bg-gray-300"
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* Subtotal */}
                  <div className="min-w-[100px]">

                    <p className="text-sm text-gray-500 mb-2">
                      Subtotal
                    </p>

                    <p className="font-bold text-lg">
                      ₹{item.subtotal}
                    </p>

                  </div>

                  {/* Remove */}
                  <button
                    onClick={() =>
                      removeItem(item.id)
                    }
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Remove
                  </button>

                </div>

              ))}

            </div>

            {/* Total */}
            <div className="bg-white rounded-xl shadow-md p-6">

              <div className="flex justify-between text-xl font-bold mb-6">

                <span>
                  Total
                </span>

                <span className="text-blue-600">
                  ₹{cart.total_amount}
                </span>

              </div>

              {/* Checkout */}
              <button
                onClick={handleCheckout}
                disabled={checkoutLoading}
                className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {checkoutLoading
                  ? "Creating Checkout..."
                  : "Proceed to Checkout"}
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Cart;


