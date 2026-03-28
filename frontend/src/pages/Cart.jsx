import React, { useEffect, useState } from "react";
import API from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      alert("Failed to load cart");
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity < 1) {
        await API.delete(`/cart/${productId}`);
      } else {
        await API.put(`/cart/${productId}`, { quantity });
      }
      fetchCart();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update quantity");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div>
      <h2>My Cart</h2>

      {!cart.items || cart.items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        cart.items.map((item, index) => (
          <div
            key={index}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
          >
            <p>Product: {item.product?.name}</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: "10px 0",
              }}
            >
              <button onClick={() => updateQuantity(item.product?._id, item.quantity - 1)}>
                -
              </button>

              <span>Quantity: {item.quantity}</span>

              <button onClick={() => updateQuantity(item.product?._id, item.quantity + 1)}>
                +
              </button>
            </div>

            <p>Price: ৳ {item.product?.price}</p>
            <p>Total: ৳ {(item.product?.price || 0) * item.quantity}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;
