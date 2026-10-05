
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import AdminProducts from "./pages/AdminProducts";
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";


  
function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" />}
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/products"
        element={<Products />}
      />

      <Route
        path="/products/:productId"
        element={<ProductDetails />}
      />

      <Route
        path="/cart"
        element={<Cart />}
      />

      <Route
        path="/payment-success"
        element={<PaymentSuccess />}
      />

      <Route
        path="/orders"
        element={<Orders />}
      />

      <Route
        path="/orders/:orderId"
        element={<OrderDetails />}
      />
      <Route
        path="/admin/products"
        element={<AdminProducts />}
       />
      <Route
        path="/admin/reports"
        element={
         <ProtectedRoute adminOnly>
         <AdminReports />
         </ProtectedRoute>
          }
         />


      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

    </Routes>
  );
}

export default App;

