import React, { useEffect, useState } from "react";
import api from "../services/api";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/seller/orders"); // adjust if needed
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/order-status/${orderId}`, { status });
      alert("Status updated");
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>

      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid gray", margin: 10, padding: 10 }}>
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Status:</b> {order.status || "Pending"}</p>

          <button onClick={() => updateStatus(order._id, "Confirmed")}>Confirm</button>
          <button onClick={() => updateStatus(order._id, "Processing")}>Processing</button>
          <button onClick={() => updateStatus(order._id, "Shipped")}>Shipped</button>
          <button onClick={() => updateStatus(order._id, "Delivered")}>Delivered</button>
          <button onClick={() => updateStatus(order._id, "Cancelled")}>Cancel</button>
        </div>
      ))}
    </div>
  );
};

export default SellerOrders;