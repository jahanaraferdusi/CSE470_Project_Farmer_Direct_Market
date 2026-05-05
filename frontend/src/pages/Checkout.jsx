import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const deliverySlots = [
  "08:00 AM - 11:00 AM",
  "11:00 AM - 02:00 PM",
  "02:00 PM - 05:00 PM",
  "05:00 PM - 08:00 PM",
  "08:00 PM - 11:00 PM",
];

const Checkout = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();

  const [referralCode, setReferralCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    shippingAddress: "",
    paymentMethod: "Cash on Delivery",
    deliverySlot: "",
  });

  const applyReferral = async () => {
    const code = referralCode.trim();

    if (!code) {
      setMessage("Please enter a referral code.");
      return;
    }

    try {
      const res = await API.post("/users/apply-referral", { code });

      if (refreshUser) {
        await refreshUser();
      }

      setMessage(res.data?.message || "Referral applied successfully!");
      setReferralCode("");
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid referral code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.shippingAddress || !form.deliverySlot) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/orders/checkout", form);

      alert("Checkout successful");
      navigate("/customer/activity");
    } catch (error) {
      setMessage(error.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Confirm your delivery details and place your order.
        </p>
      </div>

      <div className="page-card" style={{ marginBottom: "18px" }}>
        <h2 className="card-title">Referral Code</h2>

        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Referral Code</label>
            <input
              className="form-input"
              type="text"
              placeholder="Enter referral code"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
            />
          </div>

          <button type="button" className="primary-btn" onClick={applyReferral}>
            Apply Referral
          </button>
        </div>
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
              placeholder="Enter full shipping address"
              value={form.shippingAddress}
              onChange={(e) =>
                setForm({ ...form, shippingAddress: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Delivery Slot</label>
            <select
              className="form-select"
              value={form.deliverySlot}
              onChange={(e) =>
                setForm({ ...form, deliverySlot: e.target.value })
              }
              required
            >
              <option value="">Select delivery slot</option>
              {deliverySlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
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
            <strong>Note:</strong> Delivery slot will be visible to seller and
            admin.
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