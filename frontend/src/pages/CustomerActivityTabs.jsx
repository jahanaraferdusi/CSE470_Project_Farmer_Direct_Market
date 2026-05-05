import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "14px",
  marginTop: "12px",
  backgroundColor: "#fff",
};

const getReturnButtonConfig = (order) => {
  const returnStatus = order.returnSummary?.status;

  if (returnStatus === "Approved") {
    return {
      show: true,
      label: "Returned",
      disabled: true,
      backgroundColor: "#1f7a1f",
      color: "#fff",
    };
  }

  if (returnStatus === "Denied") {
    return {
      show: true,
      label: "Denied",
      disabled: true,
      backgroundColor: "#c0392b",
      color: "#fff",
    };
  }

  if (returnStatus === "Pending") {
    return {
      show: true,
      label: "Return Requested",
      disabled: true,
      backgroundColor: "#d98c00",
      color: "#fff",
    };
  }

  if (returnStatus === "Partially Approved") {
    return {
      show: true,
      label: "Partially Returned",
      disabled: true,
      backgroundColor: "#2463eb",
      color: "#fff",
    };
  }

  if (order.status === "Delivered") {
    return {
      show: true,
      label: "Return",
      disabled: false,
      backgroundColor: "#1f7a1f",
      color: "#fff",
    };
  }

  return { show: false };
};

const CustomerActivityTabs = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [actionMessage, setActionMessage] = useState("");
  const [processingOrderId, setProcessingOrderId] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await API.get("/orders/my-orders");
      setOrders(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load order history");
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleReturnRequest = async (orderId) => {
    const confirmReturn = window.confirm(
      "Are you sure you want to send a refund request to the seller?"
    );

    if (!confirmReturn) {
      return;
    }

    try {
      setProcessingOrderId(orderId);
      setActionMessage("");
      const res = await API.post(`/returns/request/${orderId}`);
      setActionMessage(res.data.message || "Return request sent successfully.");
      await fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to send return request.");
    } finally {
      setProcessingOrderId("");
    }
  };

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [orders]
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Activity</h2>
      <p>Track your product order history and return requests.</p>

      {actionMessage && (
        <div style={{ ...cardStyle, backgroundColor: "#f6fff6" }}>{actionMessage}</div>
      )}

      <div style={{ ...cardStyle, backgroundColor: "#f6fff6" }}>
        <strong>Total Orders:</strong> {orders.length}
        <br />
        <strong>Total Spent:</strong> ৳ {totalSpent}
      </div>

      {loadingOrders ? (
        <p>Loading order history...</p>
      ) : orders.length === 0 ? (
        <p>No order history found yet.</p>
      ) : (
        orders.map((order) => {
          const returnButton = getReturnButtonConfig(order);

          return (
            <div key={order._id} style={cardStyle}>
              <h3 style={{ marginTop: 0 }}>Order #{order._id.slice(-6).toUpperCase()}</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              <p><strong>Total:</strong> ৳ {order.totalAmount}</p>

              <div style={{ marginTop: "10px" }}>
                <strong>Items:</strong>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={`${order._id}-${index}`}>
                      {item.product?.name || "Product removed"} — Qty: {item.quantity} — Price: ৳ {item.price}
                    </li>
                  ))}
                </ul>
              </div>

              {returnButton.show && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "16px",
                  }}
                >
                  <button
                    type="button"
                    disabled={returnButton.disabled || processingOrderId === order._id}
                    onClick={() => handleReturnRequest(order._id)}
                    style={{
                      padding: "10px 18px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: returnButton.backgroundColor,
                      color: returnButton.color,
                      fontWeight: "bold",
                      cursor:
                        returnButton.disabled || processingOrderId === order._id
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        returnButton.disabled || processingOrderId === order._id ? 0.85 : 1,
                    }}
                  >
                    {processingOrderId === order._id ? "Sending..." : returnButton.label}
                  </button>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default CustomerActivityTabs;
