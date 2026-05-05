import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load wishlist.");
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setMessage("");

      await axios.post("http://localhost:5000/api/wishlist/remove", {
        userId,
        productId,
      });

      setMessage("Item removed from wishlist.");
      fetchWishlist();
    } catch (err) {
      console.error(err);
      setMessage("Failed to remove wishlist item.");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  if (!userId) {
    return (
      <div className="page-container">
        <div className="empty-state">Please login to view wishlist.</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Wishlist</h1>
        <p className="page-subtitle">
          Products you saved for later when they are out of stock.
        </p>
      </div>

      {message && (
        <div
          className={
            message.toLowerCase().includes("failed") ? "error-box" : "success-box"
          }
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">No wishlist items yet.</div>
      ) : (
        <div className="card-grid">
          {items.map((item) => (
            <div key={item._id} className="pretty-card">
              <div
                style={{
                  minHeight: "120px",
                  background: "#f3f8ef",
                  borderRadius: "14px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {item.product?.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product?.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "120px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span
                    style={{
                      color: "#245c2f",
                      fontWeight: "800",
                      padding: "14px",
                      textAlign: "center",
                    }}
                  >
                    {item.product?.name || "Product"}
                  </span>
                )}
              </div>

              <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                {item.product?.name || "Product unavailable"}
              </h3>

              <p style={{ color: "#607064" }}>
                <strong>Price:</strong> ৳ {item.product?.price || 0}
              </p>

              {item.product?.category && (
                <p style={{ color: "#607064" }}>
                  <strong>Category:</strong> {item.product.category}
                </p>
              )}

              <button
                type="button"
                className="danger-btn"
                onClick={() => removeItem(item.product?._id)}
                disabled={!item.product?._id}
                style={{ width: "100%", marginTop: "12px" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;