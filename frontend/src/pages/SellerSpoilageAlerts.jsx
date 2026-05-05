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
      setError(
        err?.response?.data?.message || "Failed to load spoilage alerts"
      );
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

  if (loading) {
    return (
      <div style={{ padding: "24px" }}>
        <h2>Stock Spoilage Alerts</h2>
        <p>Loading alerts...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "8px" }}>Stock Spoilage Alerts</h2>
      <p style={{ marginBottom: "24px", color: "#555" }}>
        Products nearing spoilage within 30 days, or already spoiled.
      </p>

      {error && (
        <div
          style={{
            background: "#ffe5e5",
            color: "#b00020",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {!error && products.length === 0 && (
        <div
          style={{
            background: "#f5f5f5",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <p style={{ margin: 0 }}>No spoilage alerts found.</p>
        </div>
      )}

      <div style={{ display: "grid", gap: "16px" }}>
        {products.map((product) => {
          const daysLeft = getDaysLeft(product.expiryDate);
          const isSpoiled = product.spoilageStatus === "spoiled";

          return (
            <div
              key={product._id}
              style={{
                border: "1px solid #ddd",
                borderLeft: `6px solid ${isSpoiled ? "#d32f2f" : "#f57c00"}`,
                borderRadius: "10px",
                padding: "18px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 10px 0" }}>{product.name}</h3>

                  <p style={{ margin: "4px 0" }}>
                    <strong>Category:</strong> {product.category || "N/A"}
                  </p>

                  <p style={{ margin: "4px 0" }}>
                    <strong>Stock:</strong> {product.stock}
                  </p>

                  <p style={{ margin: "4px 0" }}>
                    <strong>Price:</strong> ৳{product.price}
                  </p>

                  <p style={{ margin: "4px 0" }}>
                    <strong>Expiry Date:</strong>{" "}
                    {product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString()
                      : "Not set"}
                  </p>
                </div>

                <div style={{ minWidth: "220px" }}>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      fontWeight: "bold",
                      background: isSpoiled ? "#fdecea" : "#fff3e0",
                      color: isSpoiled ? "#c62828" : "#ef6c00",
                      marginBottom: "10px",
                    }}
                  >
                    {isSpoiled ? "Spoiled" : "Warning"}
                  </div>

                  <p style={{ margin: "6px 0" }}>
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

                  <p style={{ margin: "6px 0", color: "#555" }}>
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

      <div style={{ marginTop: "24px" }}>
        <Link
          to="/seller/stock"
          style={{
            textDecoration: "none",
            display: "inline-block",
            background: "#2e7d32",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
          }}
        >
          Back to Seller Stock
        </Link>
      </div>
    </div>
  );
};

export default SellerSpoilageAlerts;