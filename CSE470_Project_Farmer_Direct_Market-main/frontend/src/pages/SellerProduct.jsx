import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const sellerId = localStorage.getItem("userId");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`/api/products/seller/${sellerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Products</h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ccc",
              padding: "12px",
              margin: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{p.name}</h3>
            <p>Price: ৳ {p.price}</p>
            <p>Stock: {p.stock}</p>

            {/* 🔥 NEW FEATURE */}
            <p style={{ color: "crimson", fontWeight: "bold" }}>
              ❤️ Wishlist Count: {p.wishlistCount || 0}
            </p>

            {/* Optional hint */}
            {p.wishlistCount > 5 && p.stock === 0 && (
              <p style={{ color: "green" }}>
                🔥 High demand! Consider restocking.
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default SellerProducts;