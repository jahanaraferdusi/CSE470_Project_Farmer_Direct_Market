import React, { useEffect, useState } from "react";
import API from "../services/api";

const GiftCard = () => {
  const [giftCards, setGiftCards] = useState([]);
  const [latestGiftCard, setLatestGiftCard] = useState(null);
  const [limits, setLimits] = useState({
    minAmount: 5,
    maxAmount: 200,
    maxActiveGiftCards: 5,
  });

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientEmail: "",
    amount: "",
    message: "",
  });

  const [validateCode, setValidateCode] = useState("");
  const [validationResult, setValidationResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchGiftCards = async () => {
    try {
      const res = await API.get("/gift-cards/my");
      setGiftCards(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load gift cards.");
    }
  };

  const fetchLimits = async () => {
    try {
      const res = await API.get("/gift-cards/limits");
      setLimits(res.data);
    } catch (err) {
      console.log("Failed to load gift card limits.");
    }
  };

  useEffect(() => {
    fetchGiftCards();
    fetchLimits();
  }, []);

  const activeGiftCards = giftCards.filter(
    (giftCard) => giftCard.status === "active"
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    setError("");
  };

  const handleCreateGiftCard = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setLatestGiftCard(null);

    try {
      const res = await API.post("/gift-cards", formData);

      setLatestGiftCard(res.data.giftCard);

      setFormData({
        recipientName: "",
        recipientEmail: "",
        amount: "",
        message: "",
      });

      await fetchGiftCards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create gift card.");
    } finally {
      setLoading(false);
    }
  };

  const handleValidateGiftCard = async (e) => {
    e.preventDefault();
    setError("");
    setValidationResult(null);

    if (!validateCode.trim()) {
      setError("Please enter a gift card code.");
      return;
    }

    try {
      const res = await API.get(`/gift-cards/validate/${validateCode}`);
      setValidationResult(res.data);
    } catch (err) {
      setValidationResult(
        err.response?.data || {
          valid: false,
          message: "Failed to validate gift card.",
        }
      );
    }
  };

  const handleDisableGiftCard = async (giftCardId) => {
    const confirmDisable = window.confirm(
      "Are you sure you want to disable this gift card?"
    );

    if (!confirmDisable) return;

    try {
      await API.delete(`/gift-cards/${giftCardId}`);
      await fetchGiftCards();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to disable gift card.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Gift Cards</h1>
        <p className="page-subtitle">
          Create digital gift cards for fresh farm products.
        </p>
      </div>

      <div className="info-box">
        <p style={{ margin: "0 0 6px" }}>
          <strong>Amount limit:</strong> ${limits.minAmount} - $
          {limits.maxAmount}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Active gift cards:</strong> {activeGiftCards.length} /{" "}
          {limits.maxActiveGiftCards}
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      <div className="grid-2">
        <form onSubmit={handleCreateGiftCard} className="page-card">
          <h2 className="card-title">Create Gift Card</h2>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Recipient Name</label>
              <input
                className="form-input"
                type="text"
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Enter recipient name"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Recipient Email</label>
              <input
                className="form-input"
                type="email"
                name="recipientEmail"
                value={formData.recipientEmail}
                onChange={handleChange}
                placeholder="Enter recipient email"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                className="form-input"
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder={`Amount between $${limits.minAmount} and $${limits.maxAmount}`}
                min={limits.minAmount}
                max={limits.maxAmount}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write a short message"
              />
            </div>

            <button
              type="submit"
              className="primary-btn"
              disabled={
                loading || activeGiftCards.length >= limits.maxActiveGiftCards
              }
            >
              {loading ? "Creating..." : "Generate Gift Card"}
            </button>
          </div>
        </form>

        <div className="page-card">
          <h2 className="card-title">Latest Gift Card</h2>

          {latestGiftCard ? (
            <GiftCardPreview giftCard={latestGiftCard} />
          ) : (
            <div className="empty-state">
              No gift card generated yet. Fill out the form to create one.
            </div>
          )}
        </div>
      </div>

      <div className="page-card">
        <h2 className="card-title">Validate Gift Card Code</h2>

        <form
          onSubmit={handleValidateGiftCard}
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "start",
            flexWrap: "wrap",
          }}
        >
          <input
            className="form-input"
            type="text"
            value={validateCode}
            onChange={(e) => setValidateCode(e.target.value)}
            placeholder="Example: FDM-A1B2C3"
            style={{ flex: "1", minWidth: "240px" }}
          />

          <button type="submit" className="primary-btn">
            Validate
          </button>
        </form>

        {validationResult && (
          <div
            className={validationResult.valid ? "success-box" : "error-box"}
            style={{ marginTop: "16px", marginBottom: 0 }}
          >
            <p>{validationResult.message}</p>

            {validationResult.giftCard && (
              <>
                <p>
                  <strong>Code:</strong> {validationResult.giftCard.code}
                </p>
                <p>
                  <strong>Balance:</strong> $
                  {validationResult.giftCard.balance}
                </p>
                <p>
                  <strong>Status:</strong> {validationResult.giftCard.status}
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <div className="page-card">
        <h2 className="card-title">Gift Card History</h2>

        {giftCards.length === 0 ? (
          <div className="empty-state">No gift cards created yet.</div>
        ) : (
          <div className="card-grid">
            {giftCards.map((giftCard) => (
              <div key={giftCard._id} className="pretty-card">
                <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                  {giftCard.code}
                </h3>

                <p>
                  <strong>Recipient:</strong> {giftCard.recipientName}
                </p>
                <p>
                  <strong>Email:</strong> {giftCard.recipientEmail}
                </p>
                <p>
                  <strong>Amount:</strong> ${giftCard.amount}
                </p>
                <p>
                  <strong>Balance:</strong> ${giftCard.balance}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span style={getStatusStyle(giftCard.status)}>
                    {giftCard.status}
                  </span>
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(giftCard.createdAt).toLocaleDateString()}
                </p>

                {giftCard.message && (
                  <p>
                    <strong>Message:</strong> {giftCard.message}
                  </p>
                )}

                {giftCard.status === "active" && (
                  <button
                    type="button"
                    onClick={() => handleDisableGiftCard(giftCard._id)}
                    className="danger-btn"
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    Disable
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const GiftCardPreview = ({ giftCard }) => {
  return (
    <div
      style={{
        border: "2px dashed #2e7d32",
        borderRadius: "16px",
        padding: "22px",
        background:
          "linear-gradient(135deg, #f9fff9 0%, #eef8e8 100%)",
      }}
    >
      <p style={{ color: "#607064", marginTop: 0 }}>Farmer Direct Gift Card</p>

      <h3
        style={{
          fontSize: "30px",
          color: "#245c2f",
          margin: "8px 0 18px",
          letterSpacing: "1px",
        }}
      >
        {giftCard.code}
      </h3>

      <p>
        <strong>To:</strong> {giftCard.recipientName}
      </p>
      <p>
        <strong>Email:</strong> {giftCard.recipientEmail}
      </p>
      <p>
        <strong>Amount:</strong> ${giftCard.amount}
      </p>
      <p>
        <strong>Balance:</strong> ${giftCard.balance}
      </p>
      <p>
        <strong>Status:</strong> {giftCard.status}
      </p>

      {giftCard.message && (
        <p>
          <strong>Message:</strong> {giftCard.message}
        </p>
      )}
    </div>
  );
};

const getStatusStyle = (status) => {
  if (status === "active") {
    return { color: "#2e7d32", fontWeight: "bold" };
  }

  if (status === "used") {
    return { color: "#1565c0", fontWeight: "bold" };
  }

  if (status === "disabled") {
    return { color: "#c62828", fontWeight: "bold" };
  }

  return { color: "#555", fontWeight: "bold" };
};

export default GiftCard;