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
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        Farmer Direct Market
      </Link>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/harvest-calendar">Harvest Calendar</Link>

<<<<<<< HEAD
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user?.role === "customer" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/gift-card">Gift Card</Link>
            <Link to="/customer/activity">My Activity</Link>
            <Link to="/chat">Chat</Link>
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
>>>>>>> Debjyoti-Acherjee

        {user?.role === "seller" && (
          <>
            <Link to="/seller/products">My Products</Link>
            <Link to="/seller/add-product">Add Product</Link>
            <Link to="/seller/stock">Stock</Link>
            <Link to="/seller/spoilage-alerts">Spoilage Alerts</Link>
            <Link to="/seller/wishlist-stats">Wishlist Stats</Link>
            <Link to="/chat">Chats</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/seller-approval">Seller Approval</Link>
          </>
        )}

        {user && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;