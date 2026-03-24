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
            <p>Quantity: {item.quantity}</p>
            <p>Price: ৳ {item.product?.price}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default Cart;