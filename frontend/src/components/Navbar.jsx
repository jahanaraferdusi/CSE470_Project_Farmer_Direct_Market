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
      <Link to="/harvest-calendar">Harvest Calendar</Link>{" "}

      {!user && (
        <>
          <Link to="/login">Login</Link>{" "}
          <Link to="/register">Register</Link>
        </>
      )}

{user?.role === "admin" && (
  <>
    <Link to="/admin/sellers">Verify Sellers / Manage Users</Link>{" "}
    <Link to="/admin/delivery-slots">Delivery Slots</Link>{" "}
  </>
)}

{user?.role === "seller" && (
  <>
    <Link to="/seller/add-product">Add Product</Link>{" "}
    <Link to="/seller/stock">Manage Stock</Link>{" "}
    <Link to="/seller/spoilage-alerts">Spoilage Alerts</Link>{" "}
    <Link to="/seller-wishlist">Wishlist Stats</Link>{" "}
    <Link to="/seller/harvest-calendar">Manage Harvest Calendar</Link>{" "}
    <Link to="/seller/reviews">Product Reviews</Link>{" "}
    <Link to="/seller/delivery-slots">Delivery Slots</Link>{" "}
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
      {(user?.role === "customer" || user?.role === "seller") && (
      <Link to="/chat">Chat</Link>
     )}
    </nav>
  );
};

export default Navbar;
