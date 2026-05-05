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

  // ✅ Referral State
  const [referralCode, setReferralCode] = useState("");

  // ✅ Checkout Form
  const [form, setForm] = useState({
    shippingAddress: "",
    paymentMethod: "Cash on Delivery",
    deliverySlot: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ================= APPLY REFERRAL =================
  const applyReferral = async () => {
    const code = referralCode.trim();

    if (!code) {
      alert("Please enter a referral code.");
      return;
    }

    try {
      const res = await API.post("/users/apply-referral", { code });
      await refreshUser();
      alert(res.data?.message || "Referral applied successfully!");
      setReferralCode("");
    } catch (error) {
      alert(error.response?.data?.message || "Invalid referral code");
    }
  };

  // ================= CHECKOUT =================
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
        deliverySlot: "",
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
      
      {/* HEADER */}
      <div className="page-header">
        <h1 className="page-title">Checkout</h1>
        <p className="page-subtitle">
          Confirm delivery information and apply referral if available.
        </p>
      </div>

      {/* ================= REFERRAL SECTION ================= */}
      <div className="page-card">
        <h2 className="card-title">Apply Referral Code</h2>

        <input
          type="text"
          placeholder="Enter referral code"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          className="form-input"
        />

        <button type="button" className="primary-btn" onClick={applyReferral}>
          Apply Referral
        </button>
      </div>

      {/* ================= MESSAGE ================= */}
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

      {/* ================= CHECKOUT FORM ================= */}
      <form className="page-card" onSubmit={handleSubmit}>
        <h2 className="card-title">Delivery Details</h2>

        <div className="form-grid">
          {/* Address */}
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

          {/* Delivery Slot */}
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

          {/* Payment */}
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={form.paymentMethod}
              onChange={(e) =>
                setForm({ ...form, paymentMethod: e.target.value })
              }
            >
              <option value="Cash on Delivery">
                Cash on Delivery
              </option>
            </select>
          </div>

          <div className="info-box">
            <strong>Note:</strong> Delivery slot will be visible to seller and admin.
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