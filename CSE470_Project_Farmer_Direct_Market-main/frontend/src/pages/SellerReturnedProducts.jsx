import React, { useEffect, useState } from "react";
import API from "../services/api";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "16px",
  marginTop: "16px",
  backgroundColor: "#fff",
};

const statusBadgeStyle = (status) => {
  const colors = {
    Pending: { backgroundColor: "#fff4d6", color: "#a06a00" },
    Approved: { backgroundColor: "#e8f8ec", color: "#1f7a1f" },
    Denied: { backgroundColor: "#fdeaea", color: "#c0392b" },
  };

  return {
    display: "inline-block",
    padding: "6px 12px",
    borderRadius: "999px",
    fontWeight: "bold",
    ...(colors[status] || { backgroundColor: "#eee", color: "#333" }),
  };
};

const actionButtonStyle = (type) => ({
  padding: "10px 16px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  color: "#fff",
  fontWeight: "bold",
  backgroundColor: type === "approve" ? "#1f7a1f" : "#c0392b",
});

const SellerReturnedProducts = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/returns/seller");
      setRequests(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load return requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (requestId, decision) => {
    try {
      await API.put(`/returns/${requestId}/decision`, { decision });
      setMessage(`Return request ${decision.toLowerCase()} successfully.`);
      fetchRequests();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update return request.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Returned Product Page</h2>
      <p>Here you can review refund requests sent by customers.</p>

      {message && (
        <div style={{ ...cardStyle, backgroundColor: "#f6fff6", marginTop: "12px" }}>
          {message}
        </div>
      )}

      {loading ? (
        <p>Loading return requests...</p>
      ) : requests.length === 0 ? (
        <p>No return requests found.</p>
      ) : (
        requests.map((request) => (
          <div key={request._id} style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
              <h3 style={{ marginTop: 0 }}>Order #{String(request.order).slice(-6).toUpperCase()}</h3>
              <span style={statusBadgeStyle(request.status)}>{request.status}</span>
            </div>

            <p><strong>Message:</strong> {request.message}</p>
            <p><strong>Customer:</strong> {request.customer?.name || "Customer"}</p>
            <p><strong>Customer Email:</strong> {request.customer?.email || "N/A"}</p>
            <p><strong>Ordered On:</strong> {new Date(request.orderedAt).toLocaleString()}</p>
            <p><strong>Requested On:</strong> {new Date(request.createdAt).toLocaleString()}</p>
            <p><strong>Shipping Address:</strong> {request.shippingAddress}</p>
            <p><strong>Payment Method:</strong> {request.paymentMethod}</p>
            <p><strong>Order Total:</strong> ৳ {request.orderTotalAmount}</p>
            <p><strong>Requested Product Amount:</strong> ৳ {request.requestAmount}</p>

            <div style={{ marginTop: "10px" }}>
              <strong>Items:</strong>
              <ul>
                {request.items.map((item, index) => (
                  <li key={`${request._id}-${index}`}>
                    {item.productName} — Qty: {item.quantity} — Price: ৳ {item.price}
                  </li>
                ))}
              </ul>
            </div>

            {request.status === "Pending" ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "16px",
                }}
              >
                <button
                  type="button"
                  style={actionButtonStyle("approve")}
                  onClick={() => handleDecision(request._id, "Approved")}
                >
                  Approve
                </button>
                <button
                  type="button"
                  style={actionButtonStyle("deny")}
                  onClick={() => handleDecision(request._id, "Denied")}
                >
                  Deny
                </button>
              </div>
            ) : request.decidedAt ? (
              <p style={{ marginTop: "16px" }}>
                <strong>Decision Time:</strong> {new Date(request.decidedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};

export default SellerReturnedProducts;
