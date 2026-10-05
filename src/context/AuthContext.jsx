
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";
import { toast } from "react-toastify";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Used while checking whether a stored JWT is valid
  const [loading, setLoading] = useState(true);

  // ==========================================
  // RESTORE LOGIN AFTER PAGE REFRESH
  // ==========================================

  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      // No token means user is not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data);
      } catch (error) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreUser();
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================

  const login = async (email, password) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const token = response.data.access_token;

      // Save JWT
      localStorage.setItem("token", token);

      // Get logged-in user
      const userResponse = await api.get(
        "/auth/me"
      );

      setUser(userResponse.data);

      toast.success("Login successful!");

      return true;

    } catch (error) {

      const message =
        error.response?.data?.detail ||
        "Login failed";

      toast.error(message);

      localStorage.removeItem("token");
      setUser(null);

      return false;

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);

    toast.success(
      "Logged out successfully"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// CUSTOM AUTH HOOK
// ==========================================

export function useAuth() {
  return useContext(AuthContext);
}

