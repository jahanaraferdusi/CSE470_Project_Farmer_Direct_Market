import React, { useEffect, useState } from "react";
import API from "../services/api";

const DeliverySlots = ({ role }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setMessage("");

      const endpoint =
        role === "admin"
          ? "/orders/admin/delivery-slots"
          : "/orders/seller/delivery-slots";

      const res = await API.get(endpoint);
      setDeliveries(res.data);
    } catch (error) {
      setMessage("Failed to load delivery slot information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [role]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Delivery Slot List</h1>
        <p className="page-subtitle">
          View which products are selected for which delivery time.
        </p>
      </div>

      {message && <div className="error-box">{message}</div>}

      {loading ? (
        <div className="empty-state">Loading delivery slots...</div>
      ) : deliveries.length === 0 ? (
        <div className="empty-state">No delivery slot data found.</div>
      ) : (
        <div className="page-card">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Delivery Slot</th>
                {role === "admin" && <th style={thStyle}>Seller</th>}
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Address</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>

            <tbody>
              {deliveries.map((item, index) => (
                <tr key={`${item.orderId}-${index}`}>
                  <td style={tdStyle}>{item.productName}</td>
                  <td style={tdStyle}>{item.category}</td>
                  <td style={tdStyle}>{item.quantity}</td>
                  <td style={tdStyle}>
                    <strong>{item.deliverySlot}</strong>
                  </td>
                  {role === "admin" && (
                    <td style={tdStyle}>{item.sellerName}</td>
                  )}
                  <td style={tdStyle}>{item.customerName}</td>
                  <td style={tdStyle}>{item.shippingAddress}</td>
                  <td style={tdStyle}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const thStyle = {
  textAlign: "left",
  padding: "12px",
  borderBottom: "2px solid #d7e8d0",
  color: "#245c2f",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #e5e5e5",
};

export default DeliverySlots;