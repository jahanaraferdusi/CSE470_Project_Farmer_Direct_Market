import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const SellerSpoilageAlerts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSpoilageAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/products/seller/spoilage-alerts");
      setProducts(Array.isArray(res.data.products) ? res.data.products : []);
    } catch (err) {
      console.error("Failed to load spoilage alerts:", err);
      setError(err?.response?.data?.message || "Failed to load spoilage alerts.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpoilageAlerts();
  }, []);

  const getDaysLeft = (expiryDate) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Stock Spoilage Alerts</h1>
        <p className="page-subtitle">
          Products nearing spoilage within 30 days, or already spoiled.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading alerts...</div>
      ) : !error && products.length === 0 ? (
        <div className="empty-state">No spoilage alerts found.</div>
      ) : (
        <div className="form-grid">
          {products.map((product) => {
            const daysLeft = getDaysLeft(product.expiryDate);
            const isSpoiled = product.spoilageStatus === "spoiled";

            return (
              <div
                key={product._id}
                className="pretty-card"
                style={{
                  borderLeft: `7px solid ${isSpoiled ? "#c62828" : "#ef6c00"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <h3 style={{ margin: "0 0 12px", color: "#245c2f" }}>
                      {product.name}
                    </h3>

                    <p>
                      <strong>Category:</strong> {product.category || "N/A"}
                    </p>
                    <p>
                      <strong>Stock:</strong> {product.stock}
                    </p>
                    <p>
                      <strong>Price:</strong> ৳ {product.price}
                    </p>
                    <p>
                      <strong>Expiry Date:</strong>{" "}
                      {product.expiryDate
                        ? new Date(product.expiryDate).toLocaleDateString()
                        : "Not set"}
                    </p>
                  </div>

                  <div style={{ minWidth: "230px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "8px 14px",
                        borderRadius: "999px",
                        fontWeight: "800",
                        background: isSpoiled ? "#ffebee" : "#fff3e0",
                        color: isSpoiled ? "#c62828" : "#ef6c00",
                        marginBottom: "10px",
                      }}
                    >
                      {isSpoiled ? "Spoiled" : "Warning"}
                    </span>

                    <p>
                      <strong>
                        {daysLeft === null
                          ? "No expiry date"
                          : daysLeft < 0
                          ? `${Math.abs(daysLeft)} day(s) overdue`
                          : daysLeft === 0
                          ? "Expires today"
                          : `${daysLeft} day(s) left`}
                      </strong>
                    </p>

                    <p style={{ color: "#607064" }}>
                      {isSpoiled
                        ? "This product has already passed its expiry date."
                        : "This product is within the 30-day spoilage alert window."}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: "24px" }}>
        <Link to="/seller/stock" className="primary-btn">
          Back to Seller Stock
        </Link>
      </div>
    </div>
  );
};

export default SellerSpoilageAlerts;