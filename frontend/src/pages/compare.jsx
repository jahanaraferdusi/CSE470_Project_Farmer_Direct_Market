import React, { useEffect, useState } from "react";
import API from "../services/api";

const Compare = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");

  const fetchCompare = async () => {
    try {
      const res = await API.get("/compare");
      setProducts(res.data || []);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load compare list.");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchCompare();
  }, []);

  const removeProduct = async (productId) => {
    try {
      const res = await API.post("/compare/remove", { productId });
      setProducts(res.data.products || []);
      setMessage("Product removed from compare.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to remove product.");
    }
  };

  const clearCompare = async () => {
    try {
      await API.delete("/compare/clear");
      setProducts([]);
      setMessage("Compare list cleared.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to clear compare list.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Compare Products</h1>
        <p className="page-subtitle">
          Compare price and product details side by side. Maximum 3 products can
          be compared at once.
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

      {products.length === 0 ? (
        <div className="empty-state">No products added to compare.</div>
      ) : (
        <div className="page-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <h2 className="card-title">Selected Products ({products.length}/3)</h2>

            <button type="button" className="danger-btn" onClick={clearCompare}>
              Clear Compare
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${products.length}, minmax(220px, 1fr))`,
              gap: "16px",
            }}
          >
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  border: "1px solid #d9e8d2",
                  borderRadius: "16px",
                  padding: "16px",
                  background: "#ffffff",
                }}
              >
                <div
                  style={{
                    minHeight: "110px",
                    background: "#f3f8ef",
                    borderRadius: "14px",
                    marginBottom: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#245c2f",
                    fontWeight: "800",
                    textAlign: "center",
                    padding: "12px",
                  }}
                >
                  {product.name}
                </div>

                <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                  {product.name}
                </h3>

                <p>
                  <strong>Price:</strong> ৳ {product.price}
                </p>

                <p>
                  <strong>Category:</strong> {product.category || "N/A"}
                </p>

                <p>
                  <strong>Description:</strong> {product.description || "N/A"}
                </p>

                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>

                <p>
                  <strong>Expiry:</strong>{" "}
                  {product.expiryDate
                    ? new Date(product.expiryDate).toLocaleDateString()
                    : "N/A"}
                </p>

                <p>
                  <strong>Seller:</strong> {product.seller?.name || "N/A"}
                </p>

                <button
                  type="button"
                  className="danger-btn"
                  onClick={() => removeProduct(product._id)}
                  style={{ width: "100%" }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;