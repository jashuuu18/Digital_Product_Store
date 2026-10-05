
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">

      <div className="max-w-7xl mx-auto px-4 py-4">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          {/* LOGO / PROJECT NAME */}

          <Link
            to="/"
            className="text-2xl font-bold hover:text-blue-200"
          >
            Digital Product Store
          </Link>

          {/* NAVIGATION */}

          <div className="flex flex-wrap items-center gap-4">

            <Link
              to="/"
              className="hover:text-blue-200"
            >
              Home
            </Link>

            <Link
              to="/products"
              className="hover:text-blue-200"
            >
              Products
            </Link>

            {user && (
              <>
                <Link
                  to="/cart"
                  className="hover:text-blue-200"
                >
                  Cart
                </Link>

                <Link
                  to="/orders"
                  className="hover:text-blue-200"
                >
                  Orders
                </Link>
              </>
            )}

            {/* ADMIN LINKS */}

            {user?.role === "admin" && (
              <>
                <Link
                  to="/admin"
                  className="font-semibold hover:text-yellow-200"
                >
                  Admin Dashboard
                </Link>

                <Link
                  to="/admin/products"
                  className="hover:text-yellow-200"
                >
                  Admin Products
                </Link>

                <Link
                  to="/admin/orders"
                  className="hover:text-yellow-200"
                >
                  Admin Orders
                </Link>
              </>
            )}

            {/* LOGIN / REGISTER */}

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="border border-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                {/* USER INFORMATION */}

                <span className="text-sm">
                  Welcome,{" "}
                  <span className="font-semibold">
                    {user.username}
                  </span>
                </span>

                {/* LOGOUT */}

                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;

