import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const tabButtonStyle = (active) => ({
  padding: "10px 16px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  cursor: "pointer",
  backgroundColor: active ? "#1f7a1f" : "#fff",
  color: active ? "#fff" : "#222",
  fontWeight: active ? "bold" : "normal",
});

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "10px",
  padding: "14px",
  marginTop: "12px",
  backgroundColor: "#fff",
};

const CustomerActivityTabs = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchDiscountedProducts();
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

  const fetchDiscountedProducts = async () => {
    try {
      setLoadingDiscounts(true);
      const res = await API.get("/products/discounted");
      setDiscountedProducts(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load discounted products");
    } finally {
      setLoadingDiscounts(false);
    }
  };

  const totalSpent = useMemo(
    () => orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0),
    [orders]
  );

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Activity</h2>
      <p>Track what you ordered and quickly browse products currently on discount.</p>

      <div style={{ display: "flex", gap: "10px", marginTop: "16px", marginBottom: "20px" }}>
        <button style={tabButtonStyle(activeTab === "orders")} onClick={() => setActiveTab("orders")}>
          Product Order History
        </button>
        <button style={tabButtonStyle(activeTab === "discounts")} onClick={() => setActiveTab("discounts")}>
          Discounted Products
        </button>
      </div>

      {activeTab === "orders" && (
        <div>
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
            orders.map((order) => (
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
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "discounts" && (
        <div>
          {loadingDiscounts ? (
            <p>Loading discounted products...</p>
          ) : discountedProducts.length === 0 ? (
            <p>No discounted products are available right now.</p>
          ) : (
            discountedProducts.map((product) => (
              <div key={product._id} style={cardStyle}>
                <h3 style={{ marginTop: 0 }}>{product.name}</h3>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Seller:</strong> {product.seller?.name || "Unknown Seller"}</p>
                <p>
                  <strong>Discounted Price:</strong> ৳ {product.price}
                  {product.originalPrice && (
                    <>
                      {" "}
                      <span style={{ textDecoration: "line-through", color: "#666" }}>
                        ৳ {product.originalPrice}
                      </span>
                    </>
                  )}
                </p>
                <p><strong>Discount:</strong> {product.discountPercentage || 0}% off</p>
                <p><strong>Stock Left:</strong> {product.stock}</p>
                {product.description && <p><strong>Description:</strong> {product.description}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerActivityTabs;