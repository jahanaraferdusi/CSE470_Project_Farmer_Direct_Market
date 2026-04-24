import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

const SellerStock = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [expiryInputs, setExpiryInputs] = useState({});

  const fetchProducts = async () => {
    try {
      if (!user?._id) return;

      const res = await API.get(`/products/seller/${user._id}`);
      setProducts(res.data);

      const initialStockInputs = {};
      const initialExpiryInputs = {};

      res.data.forEach((product) => {
        initialStockInputs[product._id] = product.stock;
        initialExpiryInputs[product._id] = product.expiryDate
          ? new Date(product.expiryDate).toISOString().split("T")[0]
          : "";
      });

      setStockInputs(initialStockInputs);
      setExpiryInputs(initialExpiryInputs);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleStockChange = (productId, value) => {
    setStockInputs({ ...stockInputs, [productId]: value });
  };

  const handleExpiryChange = (productId, value) => {
    setExpiryInputs({ ...expiryInputs, [productId]: value });
  };

  const handleUpdateStock = async (productId) => {
    try {
      await API.put(`/products/${productId}/stock`, {
        stock: Number(stockInputs[productId]),
        expiryDate: expiryInputs[productId] || null,
      });

      alert("Stock updated successfully");
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update stock");
    }
  };

  return (
    <div>
      <h2>Manage Product Stock</h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}
          >
            <p>Name: {product.name}</p>
            <p>Current Stock: {product.stock}</p>
            <p>
              Expiry Date:{" "}
              {product.expiryDate
                ? new Date(product.expiryDate).toLocaleDateString()
                : "Not set"}
            </p>

            {product.lowStockAlert && (
              <p style={{ color: "red" }}>Low stock alert</p>
            )}

            {product.spoilageStatus === "warning" && (
              <p style={{ color: "orange" }}>
                Spoilage warning: within 30 days of expiry
              </p>
            )}

            {product.spoilageStatus === "spoiled" && (
              <p style={{ color: "red" }}>Product already spoiled</p>
            )}

            <input
              type="number"
              value={stockInputs[product._id] || ""}
              onChange={(e) => handleStockChange(product._id, e.target.value)}
              placeholder="Update stock"
            />

            <input
              type="date"
              value={expiryInputs[product._id] || ""}
              onChange={(e) => handleExpiryChange(product._id, e.target.value)}
            />

            <button onClick={() => handleUpdateStock(product._id)}>
              Update Stock
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerStock;
