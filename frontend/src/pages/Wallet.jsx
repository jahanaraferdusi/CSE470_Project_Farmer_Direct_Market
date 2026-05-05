import React, { useEffect, useState } from "react";
import API from "../services/api";

const Wallet = () => {
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] });
  const [amount, setAmount] = useState("");
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);

  const getWallet = async () => {
    try {
      const res = await API.get("/wallet");
      setWallet(res.data.wallet || { balance: 0, transactions: [] });
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to load wallet");
    }
  };

  useEffect(() => {
    getWallet();
  }, []);

  const handleCheckoutPayment = () => {
    setMessage("");

    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount");
      return;
    }

    setShowPaymentPopup(true);
  };

  const closePaymentPopup = () => {
    setShowPaymentPopup(false);
    setAmount("");
    setMessage("Payment pending. Balance will update after payment API is connected.");
  };

  const applyGiftCard = async () => {
    try {
      setMessage("");

      if (!code) {
        setMessage("Please enter a gift card code");
        return;
      }

      const res = await API.post("/wallet/add-gift-card", { code });

      setWallet(res.data.wallet);
      setCode("");
      setMessage("Gift card added to wallet successfully");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply gift card");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Smart Wallet</h1>
        <p className="page-subtitle">
          Store website credit, add money through online payment, and redeem gift cards.
        </p>
      </div>

      {message && <div className="success-box">{message}</div>}

      <div className="page-card">
        <h2 className="card-title">Wallet Balance</h2>
        <h1 style={{ color: "#245c2f" }}>৳ {wallet.balance || 0}</h1>
      </div>

      <div className="page-card">
        <h2 className="card-title">Add Money</h2>

        <div style={{ display: "grid", gap: "14px" }}>
          <div>
            <label>Add Money Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div
            style={{
              padding: "14px",
              border: "1px solid #d9e8d2",
              borderRadius: "12px",
              background: "#f8fcf6",
            }}
          >
            <p>
              <strong>Payment Method:</strong> Online Payment Only
            </p>
            <p>
              <strong>Amount:</strong> ৳ {amount || 0}
            </p>
          </div>

          <button
            type="button"
            className="primary-btn"
            onClick={handleCheckoutPayment}
          >
            Checkout
          </button>
        </div>
      </div>

      <div className="page-card">
        <h2 className="card-title">Add Gift Card</h2>

        <input
          placeholder="Enter gift card code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          type="button"
          className="secondary-btn"
          onClick={applyGiftCard}
          style={{ marginTop: "12px" }}
        >
          Add Gift Card
        </button>
      </div>

      {showPaymentPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "18px",
              width: "360px",
              textAlign: "center",
              boxShadow: "0 12px 35px rgba(0,0,0,0.2)",
            }}
          >
            <h2 style={{ color: "#245c2f" }}>Online Payment</h2>
            <p>Payment amount: ৳ {amount}</p>
            <h3 style={{ color: "#c47f00" }}>Payment Pending</h3>
            <p>
              Payment gateway URL/API will be connected later.
            </p>

            <button
              type="button"
              className="primary-btn"
              onClick={closePaymentPopup}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;