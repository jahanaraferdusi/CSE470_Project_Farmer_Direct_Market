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

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && <Link to="/reffer">Reffer</Link>}

        {user?.role === "customer" && (
          <>
            <Link to="/cart">Cart</Link>
            <Link to="/checkout">Checkout</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/gift-card">Gift Card</Link>
            <Link to="/customer/activity">My Activity</Link>
            <Link to="/polls">Product Polls</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/track-order">Track Order</Link>
            <Link to="/compare">Compare</Link>
          </>
        )}

        {user?.role === "seller" && (
          <>
            <Link to="/seller/products">My Products</Link>
            <Link to="/seller/add-product">Add Product</Link>
            <Link to="/seller/stock">Stock</Link>
            <Link to="/seller/spoilage-alerts">Spoilage Alerts</Link>
            <Link to="/seller/wishlist-stats">Wishlist Stats</Link>
            <Link to="/seller/harvest-calendar">Manage Harvest Calendar</Link>
            <Link to="/seller/reviews">Product Reviews</Link>
            <Link to="/seller/delivery-slots">Delivery Slots</Link>
            <Link to="/seller/polls">Product Polls</Link>
            <Link to="/seller/returned-products">Returned Products</Link>
            <Link to="/chat">Chats</Link>
          </>
        )}

        {user?.role === "admin" && (
          <>
            <Link to="/admin/seller-approval">Seller Approval</Link>
            <Link to="/admin/delivery-slots">Delivery Slots</Link>
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