import React, { useState } from "react";
import API from "../services/api";

const SellerAddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    lowStockThreshold: 5,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold),
      });

      alert("Product added successfully");

      setForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        lowStockThreshold: 5,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Product</h2>

      <input
        type="text"
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />

      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
      />

      <input
        type="number"
        name="lowStockThreshold"
        placeholder="Low stock threshold"
        value={form.lowStockThreshold}
        onChange={handleChange}
      />

      <button type="submit">Add Product</button>
    </form>
  );
};

export default SellerAddProduct;