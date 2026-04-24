import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Checkout = () => {
  const [form, setForm] = useState({
    shippingAddress: "",
    paymentMethod: "Cash on Delivery",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.post("/orders/checkout", form);

      setMessage("Checkout successful. Redirecting to cart...");
      setForm({
        shippingAddress: "",
        paymentMethod: "Cash on Delivery",
      });

      setTimeout(() => {
        navigate("/cart");
      }, 900);
    } catch (error) {
      setMessage(error.response?.data?.message || "Checkout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "700px" }}>
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Confirm your delivery information and place your order.
        </p>
      </div>

      {message && (
        <div
          className={
            message.toLowerCase().includes("successful")
              ? "success-box"
              : "error-box"
          }
        >
          {message}
        </div>
      )}

      <form className="page-card" onSubmit={handleSubmit}>
        <h2 className="card-title">Delivery Details</h2>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Shipping Address</label>
            <textarea
              className="form-textarea"
              placeholder="Enter your full shipping address"
              value={form.shippingAddress}
              onChange={(e) =>
                setForm({ ...form, shippingAddress: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <div className="info-box">
            <strong>Note:</strong> Your order will be placed using the items
            currently in your cart.
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;