import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [wished, setWished] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user"));
  const handleAddToWishlist = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      await API.post("/wishlist/add", {
        userId,
        productId: product._id,
      });

      setWished(true);
    } catch (err) {
      if (err.response?.data?.msg === "Already wished") {
        setWished(true);
      } else {
        alert("Error adding to wishlist");
      }
    } finally {
      setLoading(false);
    }
  };
const handleChatWithSeller = async () => {
  if (!userId) {
    alert("Please login first");
    return;
  }

  const handleAddToCompare = async () => {
    if (!user || user.role !== "customer") {
      alert("Please login as customer to compare products.");
      navigate("/login");
      return;
    }

    try {
      await API.post("/compare/add", {
        productId: product._id,
      });

      alert("Product added to compare.");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to compare.");
    }
  };

  const handleStartChat = async (e) => {
    e.preventDefault();

    if (!user || user.role !== "customer") {
      alert("Please login as customer to message the seller.");
      navigate("/login");
      return;
    }

    if (!chatText.trim()) {
      alert("Please write a message first.");
      return;
    }

    try {
      setSendingChat(true);

      await API.post("/chats/send", {
        productId: product._id,
        text: chatText.trim(),
      });

      setChatText("");
      setChatOpen(false);
      navigate("/chat");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to start chat.");
    } finally {
      setSendingChat(false);
    }
  };

  return (
    <div className="product-card">
      <Link
        to={`/products/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          style={{
            minHeight: "120px",
            background: "#f3f8ef",
            borderRadius: "14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#245c2f",
            fontWeight: "800",
            fontSize: "18px",
            textAlign: "center",
            padding: "14px",
          }}
        >
          {product.name}
        </div>
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <h3 style={{ margin: "0 0 8px", color: "#245c2f" }}>
          {product.name}
        </h3>

        <span
          style={{
            background: isOutOfStock ? "#ffebee" : "#e8f5e9",
            color: isOutOfStock ? "#b71c1c" : "#1b5e20",
            padding: "5px 9px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "800",
            height: "fit-content",
            whiteSpace: "nowrap",
          }}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      <p style={{ margin: "8px 0", color: "#607064" }}>
        <strong>Category:</strong> {product.category || "N/A"}
      </p>

      {product.description && (
        <p style={{ margin: "8px 0", color: "#607064" }}>
          {product.description}
        </p>
      )}

      <div style={{ margin: "14px 0" }}>
        <span
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#245c2f",
          }}
        >
          ৳ {product.price}
        </span>

        {product.isDiscounted && product.originalPrice ? (
          <>
            <span
              style={{
                textDecoration: "line-through",
                color: "#777",
                marginLeft: "8px",
              }}
            >
              ৳ {product.originalPrice}
            </span>

            <span
              style={{
                color: "#c62828",
                fontWeight: "800",
                marginLeft: "8px",
                fontSize: "13px",
              }}
            >
              {product.discountPercentage}% OFF
            </span>
          </>
        ) : null}
      </div>

      {product.averageRating !== undefined && (
        <p style={{ margin: "8px 0", color: "#607064" }}>
          <strong>Rating:</strong>{" "}
          {product.averageRating > 0
            ? `${product.averageRating} ⭐ (${product.reviewCount || 0})`
            : "No reviews yet"}
        </p>
      )}

      <p style={{ margin: "8px 0 16px", color: "#607064" }}>
        <strong>Available Stock:</strong> {product.stock}
      </p>

      {product.expiryDate && (
        <p style={{ margin: "8px 0 16px", color: "#607064" }}>
          <strong>Expiry:</strong>{" "}
          {new Date(product.expiryDate).toLocaleDateString()}
        </p>
      )}

      {product.stock > 0 ? (
        <button
          onClick={() => onAddToCart(product._id)}
          style={{
            padding: "8px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      ) : (
        <button
          onClick={handleAddToWishlist}
          disabled={loading || wished}
          style={{
            padding: "8px",
            backgroundColor: wished ? "gray" : "crimson",
            color: "white",
            border: "none",
            cursor: wished ? "not-allowed" : "pointer",
          }}
        >
          {wished ? "❤️ Added to Wishlist" : "❤️ Add to Wishlist"}
        </button>
      )}

      <button
        type="button"
        className="secondary-btn"
        onClick={handleAddToCompare}
        style={{ width: "100%", marginTop: "10px" }}
      >
        Compare
      </button>

      <button
        type="button"
        className="secondary-btn"
        onClick={() => setChatOpen(!chatOpen)}
        style={{ width: "100%", marginTop: "10px" }}
      >
        💬 Message Seller
      </button>

      {chatOpen && (
        <form onSubmit={handleStartChat} style={{ marginTop: "12px" }}>
          <textarea
            className="form-input"
            rows="3"
            placeholder={`Ask seller about ${product.name}`}
            value={chatText}
            onChange={(e) => setChatText(e.target.value)}
            style={{ resize: "none" }}
          />

          <button
            type="submit"
            className="primary-btn"
            disabled={sendingChat}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {sendingChat ? "Sending..." : "Start Conversation"}
          </button>
        </form>
      )}

      <Link
        to={`/products/${product._id}`}
        className="secondary-btn"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        View Product
      </Link>

      <Link
        to={`/products/${product._id}/reviews`}
        className="secondary-btn"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Reviews
      </Link>
    </div>
  );
};
};
export default { ProductCard };
