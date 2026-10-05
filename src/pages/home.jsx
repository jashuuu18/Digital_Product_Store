
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HERO SECTION */}

      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

        <div className="max-w-7xl mx-auto px-6 py-20">

          <div className="max-w-3xl">

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Digital Product Store
            </h1>

            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Discover high-quality digital courses, programming
              resources and development products in one place.
            </p>

            <div className="flex flex-wrap gap-4">

              <Link
                to="/products"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
              >
                Browse Products
              </Link>

              {!user && (
                <Link
                  to="/register"
                  className="border border-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
                >
                  Create Account
                </Link>
              )}

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300"
                >
                  Admin Dashboard
                </Link>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* FEATURES */}

      <section className="max-w-7xl mx-auto px-6 py-16">

        <div className="text-center mb-12">

          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose Our Store?
          </h2>

          <p className="text-gray-600 mt-3">
            Everything you need for your digital learning journey.
          </p>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* FEATURE 1 */}

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <div className="text-5xl mb-5">
              📚
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Quality Products
            </h3>

            <p className="text-gray-600">
              Access programming courses and digital
              products designed for practical learning.
            </p>

          </div>

          {/* FEATURE 2 */}

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <div className="text-5xl mb-5">
              🔒
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Secure Payments
            </h3>

            <p className="text-gray-600">
              Complete your purchases securely using
              Stripe payment processing.
            </p>

          </div>

          {/* FEATURE 3 */}

          <div className="bg-white rounded-xl shadow p-8 text-center">

            <div className="text-5xl mb-5">
              ⚡
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Easy Shopping
            </h3>

            <p className="text-gray-600">
              Search products, add them to your cart,
              checkout and track your orders easily.
            </p>

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="bg-white border-t">

        <div className="max-w-7xl mx-auto px-6 py-14 text-center">

          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Learning?
          </h2>

          <p className="text-gray-600 mb-7">
            Explore our digital products and find something
            useful for your next project.
          </p>

          <Link
            to="/products"
            className="inline-block bg-blue-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Explore Products
          </Link>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="bg-gray-900 text-gray-300">

        <div className="max-w-7xl mx-auto px-6 py-8 text-center">

          <p>
            © 2026 Digital Product Store
          </p>

          <p className="text-sm mt-2 text-gray-400">
            Built with React, FastAPI, SQLAlchemy and Stripe.
          </p>

        </div>

      </footer>

    </div>
  );
}

export default Home;

