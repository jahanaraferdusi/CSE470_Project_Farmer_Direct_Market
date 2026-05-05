import React, { useEffect, useState } from "react";
import API from "../services/api";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/seller/orders");
      setOrders(res.data || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load seller orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/order-status/${orderId}`, { status });
      alert("Order status updated");
      fetchOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="page-container">
      <h1>Manage Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="page-card" style={{ marginBottom: "16px" }}>
            <h3>Order ID: {order._id}</h3>
            <p><strong>Customer:</strong> {order.customerName}</p>
            <p><strong>Email:</strong> {order.customerEmail}</p>
            <p><strong>Total:</strong> ৳ {order.totalAmount}</p>
            <p><strong>Delivery Slot:</strong> {order.deliverySlot}</p>
            <p><strong>Status:</strong> {order.status}</p>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    className="secondary-btn"
                    onClick={() => updateStatus(order._id, status)}
                  >
                    {status}
                  </button>
                )
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerOrders;