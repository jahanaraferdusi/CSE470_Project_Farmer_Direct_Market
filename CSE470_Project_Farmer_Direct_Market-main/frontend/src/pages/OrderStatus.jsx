import React, { useState } from "react";
import axios from "axios";

const OrderStatus = () => {
  const [orderId, setOrderId] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    try {
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/order-status/${orderId}`
      );

      setStatus(res.data);
    } catch (err) {
      console.error(err);
      setError("Order not found");
      setStatus(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Track Order</h2>

      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />

      <button onClick={fetchStatus}>Track</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {status && (
        <div>
          <h3>
            Current Status: {status.currentStatus || "No status"}
          </h3>

          {status.statusHistory?.length > 0 ? (
            <ul>
              {status.statusHistory.map((s, i) => (
                <li key={i}>
                  {s.status} -{" "}
                  {new Date(s.date).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No history available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatus;