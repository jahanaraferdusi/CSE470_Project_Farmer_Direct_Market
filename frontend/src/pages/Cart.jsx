import React, { useEffect, useState } from "react";
import API from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      setMessage("Failed to load cart.");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!productId) return;

    try {
      setMessage("");

      if (quantity < 1) {
        await API.delete(`/cart/${productId}`);
        setMessage("Item removed from cart.");
      } else {
        await API.put(`/cart/${productId}`, { quantity });
        setMessage("Cart updated successfully.");
      }

      fetchCart();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to update quantity.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const cartItems = cart.items || [];

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Cart</h1>
        <p className="page-subtitle">
          Review your selected farm products before checkout.
        </p>
      </div>

      {message && (
        <div
          className={
            message.toLowerCase().includes("failed") ? "error-box" : "success-box"
          }
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading cart...</div>
      ) : cartItems.length === 0 ? (
        <div className="empty-state">No items in cart.</div>
      ) : (
        <div className="grid-2">
          <div>
            {cartItems.map((item, index) => {
              const productId = item.product?._id;
              const price = item.product?.price || 0;
              const itemTotal = price * item.quantity;

              return (
                <div className="page-card" key={productId || index}>
                  <h2 className="card-title">
                    {item.product?.name || "Product unavailable"}
                  </h2>

                  <p style={{ color: "#607064" }}>
                    <strong>Price:</strong> ৳ {price}
                  </p>

                  <p style={{ color: "#607064" }}>
                    <strong>Item Total:</strong> ৳ {itemTotal}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginTop: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() =>
                        updateQuantity(productId, item.quantity - 1)
                      }
                    >
                      -
                    </button>

                    <span
                      style={{
                        fontWeight: "800",
                        background: "#f3f8ef",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        color: "#245c2f",
                      }}
                    >
                      Quantity: {item.quantity}
                    </span>

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={() =>
                        updateQuantity(productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => updateQuantity(productId, 0)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="page-card" style={{ height: "fit-content" }}>
            <h2 className="card-title">Order Summary</h2>

            <div className="info-box">
              <p>
                <strong>Total Items:</strong> {cartItems.length}
              </p>
              <p>
                <strong>Cart Total:</strong> ৳ {cartTotal}
              </p>
            </div>

            <a href="/checkout" className="primary-btn" style={{ display: "block", textAlign: "center" }}>
              Proceed to Checkout
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;