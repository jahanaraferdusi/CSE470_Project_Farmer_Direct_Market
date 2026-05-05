import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const SellerStock = () => {
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [expiryInputs, setExpiryInputs] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      if (!user?._id) return;

      setLoading(true);
      setMessage("");

      const res = await API.get(`/products/seller/${user._id}`);
      setProducts(res.data);

      const initialStockInputs = {};
      const initialExpiryInputs = {};

      res.data.forEach((product) => {
        initialStockInputs[product._id] = product.stock;
        initialExpiryInputs[product._id] = product.expiryDate
          ? new Date(product.expiryDate).toISOString().split("T")[0]
          : "";
      });

      setStockInputs(initialStockInputs);
      setExpiryInputs(initialExpiryInputs);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleStockChange = (productId, value) => {
    setStockInputs({ ...stockInputs, [productId]: value });
    setMessage("");
  };

  const handleExpiryChange = (productId, value) => {
    setExpiryInputs({ ...expiryInputs, [productId]: value });
    setMessage("");
  };

  const handleUpdateStock = async (productId) => {
    try {
      setMessage("");

      await API.put(`/products/${productId}/stock`, {
        stock: Number(stockInputs[productId]),
        expiryDate: expiryInputs[productId] || null,
      });

      setMessage("Stock updated successfully.");
      fetchProducts();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update stock.");
    }
  };

  const getSpoilageBox = (product) => {
    if (product.spoilageStatus === "spoiled") {
      return <div className="error-box">Product already spoiled.</div>;
    }

    if (product.spoilageStatus === "warning") {
      return (
        <div
          style={{
            background: "#fff3e0",
            color: "#ef6c00",
            border: "1px solid #ffe0b2",
            borderRadius: "12px",
            padding: "14px 16px",
            marginBottom: "18px",
          }}
        >
          Spoilage warning: within 30 days of expiry.
        </div>
      );
    }

    return null;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Manage Product Stock</h1>
        <p className="page-subtitle">
          Update product stock and expiry dates to keep customers informed.
        </p>
      </div>

      {message && (
        <div
          className={
            message.toLowerCase().includes("successfully")
              ? "success-box"
              : "error-box"
          }
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="card-grid">
          {products.map((product) => (
            <div key={product._id} className="pretty-card">
              <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                {product.name}
              </h3>

              <p>
                <strong>Current Stock:</strong> {product.stock}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {product.expiryDate
                  ? new Date(product.expiryDate).toLocaleDateString()
                  : "Not set"}
              </p>

              {product.lowStockAlert && (
                <div className="error-box">Low stock alert.</div>
              )}

              {getSpoilageBox(product)}

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Update Stock</label>
                  <input
                    className="form-input"
                    type="number"
                    value={stockInputs[product._id] || ""}
                    onChange={(e) =>
                      handleStockChange(product._id, e.target.value)
                    }
                    placeholder="Update stock"
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    className="form-input"
                    type="date"
                    value={expiryInputs[product._id] || ""}
                    onChange={(e) =>
                      handleExpiryChange(product._id, e.target.value)
                    }
                  />
                </div>

                <button
                  type="button"
                  className="primary-btn"
                  onClick={() => handleUpdateStock(product._id)}
                >
                  Update Stock
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerStock;