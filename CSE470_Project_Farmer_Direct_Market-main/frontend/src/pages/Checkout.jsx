import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Checkout = () => {
  const [form, setForm] = useState({
    shippingAddress: "",
    paymentMethod: "Cash on Delivery",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/orders/checkout", form);
      alert("Checkout successful");
      navigate("/cart");
    } catch (error) {
      alert(error.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Checkout</h2>

      <input
        type="text"
        placeholder="Shipping address"
        value={form.shippingAddress}
        onChange={(e) =>
          setForm({ ...form, shippingAddress: e.target.value })
        }
      />

      <select
        value={form.paymentMethod}
        onChange={(e) =>
          setForm({ ...form, paymentMethod: e.target.value })
        }
      >
        <option value="Cash on Delivery">Cash on Delivery</option>
      </select>

      <button type="submit">Place Order</button>
    </form>
  );
};

export default Checkout;
