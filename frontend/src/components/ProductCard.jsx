import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const ProductCard = ({ product, onAddToCart }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [wished, setWished] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [sendingChat, setSendingChat] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = localStorage.getItem("userId");
  const isOutOfStock = product.stock <= 0;

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

      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
        <h3 style={{ margin: "0 0 8px", color: "#245c2f" }}>{product.name}</h3>

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
        <span style={{ fontSize: "22px", fontWeight: "800", color: "#245c2f" }}>
          ৳ {product.price}
        </span>
      </div>

      <p style={{ margin: "8px 0 16px", color: "#607064" }}>
        <strong>Available Stock:</strong> {product.stock}
      </p>

      {product.stock > 0 ? (
        <button
          type="button"
          className="primary-btn"
          onClick={() => onAddToCart(product._id)}
          style={{ width: "100%" }}
        >
          Add to Cart
        </button>
      ) : (
        <button
          type="button"
          className={wished ? "secondary-btn" : "danger-btn"}
          onClick={handleAddToWishlist}
          disabled={loading || wished}
          style={{ width: "100%" }}
        >
          {loading ? "Adding..." : wished ? "❤️ Added to Wishlist" : "❤️ Add to Wishlist"}
        </button>
      )}

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

      <a
        href={`/products/${product._id}/reviews`}
        className="secondary-btn"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Reviews
      </a>
    </div>
  );
};

export default ProductCard;