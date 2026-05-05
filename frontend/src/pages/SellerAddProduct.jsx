import React, { useState } from "react";
import API from "../services/api";

const initialForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  lowStockThreshold: 5,
  expiryDate: "",
};

const SellerAddProduct = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await API.post("/products", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold),
        expiryDate: form.expiryDate || null,
      });

      setMessage("Product added successfully.");
      setForm(initialForm);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: "760px" }}>
      <div className="page-header">
        <h1 className="page-title">Add Product</h1>
        <p className="page-subtitle">
          Add new farm products for customers to browse and purchase.
        </p>
      </div>

      {message && (
        <div
          className={
            message.toLowerCase().includes("successfully")
              ? "success-box"
              : "error-box"
          }
        >
          {message}
        </div>
      )}

      <form className="page-card" onSubmit={handleSubmit}>
        <h2 className="card-title">Product Information</h2>

        <div className="form-grid">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Example: Fresh Tomatoes"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className="form-input"
                type="text"
                name="category"
                placeholder="Example: Vegetables"
                value={form.category}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Price</label>
              <input
                className="form-input"
                type="number"
                name="price"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Stock</label>
              <input
                className="form-input"
                type="number"
                name="stock"
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Low Stock Alert</label>
              <input
                className="form-input"
                type="number"
                name="lowStockThreshold"
                placeholder="Low stock threshold"
                value={form.lowStockThreshold}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Expiry Date</label>
            <input
              className="form-input"
              type="date"
              name="expiryDate"
              value={form.expiryDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              name="description"
              placeholder="Write a short product description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? "Adding Product..." : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerAddProduct;