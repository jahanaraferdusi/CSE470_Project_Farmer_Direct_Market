import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const Reffer = () => {
  const { user, setUser, refreshUser } = useAuth();
  const [referralCode, setReferralCode] = useState(user?.referralCode || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setReferralCode(user?.referralCode || "");
  }, [user]);

  const handleGenerateReferralCode = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await API.post("/users/generate-referral");
      const updatedUser = res.data.user;

      setReferralCode(res.data.referralCode);

      if (updatedUser) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      } else {
        await refreshUser();
      }

      setMessage(res.data.message || "Referral code generated successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Could not generate referral code.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReferralCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      setMessage("Referral code copied to clipboard.");
      setError("");
    } catch (error) {
      setError("Could not copy referral code. Please copy it manually.");
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "720px" }}>
      <div className="page-header">
        <h1 className="page-title">Reffer</h1>
        <p className="page-subtitle">Generate and share your referral code.</p>
      </div>

      {error && <div className="error-box">{error}</div>}
      {message && <div className="success-box">{message}</div>}

      <div className="page-card">
        <h2 className="card-title">Referral</h2>

        <div className="info-box">
          <p style={{ margin: "0 0 8px" }}>
            <strong>Name:</strong> {user?.name}
          </p>
          <p style={{ margin: 0 }}>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Your Referral Code</label>
          <input
            className="form-input"
            value={referralCode || "No referral code generated yet"}
            readOnly
          />
        </div>

        <div style={{ display: "flex", gap: "12px", marginTop: "18px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="primary-btn"
            onClick={handleGenerateReferralCode}
            disabled={loading}
          >
            {loading ? "Generating..." : referralCode ? "Show Referral Code" : "Generate Referral Code"}
          </button>

          {referralCode && (
            <button
              type="button"
              className="secondary-btn"
              onClick={handleCopyReferralCode}
            >
              Copy Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reffer;
