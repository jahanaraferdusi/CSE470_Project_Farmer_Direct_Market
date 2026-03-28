import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav style={{ padding: "12px", borderBottom: "1px solid #ccc" }}>
      <Link to="/">Home</Link>{" "}

      {!user && (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </>
      )}

      {user?.role === "admin" && (
        <>
          <Link to="/admin/sellers">Verify Sellers / Manage Users</Link>{" "}
        </>
      )}

      {user?.role === "seller" && (
        <>
          <Link to="/seller/add-product">Add Product</Link>{" "}
          <Link to="/seller/stock">Manage Stock</Link>{" "}
          <Link to="/seller/spoilage-alerts">Spoilage Alerts</Link>{" "}
          <Link to="/seller-wishlist">Wishlist Stats</Link>
        </>
      )}

      {user?.role === "customer" && (
        <>
          <Link to="/cart">Cart</Link>{" "}
          <Link to="/checkout">Checkout</Link>{" "}
          <Link to="/wishlist">Wishlist</Link>
        </>
      )}

      {user && (
        <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
          Logout
        </button>
      )}
    </nav>
  );
};

export default Navbar;
