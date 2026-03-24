
import React, { useEffect, useState } from "react";
import API from "../services/api";

const SellerStock = () => {
  const [products, setProducts] = useState([]);
  const [stockInputs, setStockInputs] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);

      const initialInputs = {};
      res.data.forEach((product) => {
        initialInputs[product._id] = product.stock;
      });
      setStockInputs(initialInputs);
    } catch (error) {
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleInputChange = (productId, value) => {
    setStockInputs({ ...stockInputs, [productId]: value });
  };

  const handleUpdateStock = async (productId) => {
    try {
      await API.put(`/products/${productId}/stock`, {
        stock: Number(stockInputs[productId]),
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

            {product.lowStockAlert && (
              <p style={{ color: "red" }}>Low stock alert</p>
            )}

            <input
              type="number"
              value={stockInputs[product._id] || ""}
              onChange={(e) =>
                handleInputChange(product._id, e.target.value)
              }
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