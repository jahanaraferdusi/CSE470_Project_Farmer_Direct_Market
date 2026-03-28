import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerWishlistStats = () => {
  const [products, setProducts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user?._id) {
      fetchStats();
    }
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/wishlist/seller/${user._id}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.msg || "Failed to load wishlist stats");
    }
  };

  if (!user) {
    return <h2>Please login first</h2>;
  }

  return (
    <div>
      <h2>Wishlist Stats</h2>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <h3>{product.name}</h3>
            <p>Price: ৳ {product.price}</p>
            <p>Stock: {product.stock}</p>
            <p>Total wished by customers: {product.wishlistCount || 0}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerWishlistStats;