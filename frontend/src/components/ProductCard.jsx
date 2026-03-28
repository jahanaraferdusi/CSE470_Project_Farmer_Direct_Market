import React, { useState } from "react";
import axios from "axios";

const ProductCard = ({ product, onAddToCart }) => {
  const [loading, setLoading] = useState(false);
  const [wished, setWished] = useState(false);

  const userId = localStorage.getItem("userId");

  const handleAddToWishlist = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:5000/api/wishlist/add", {
        userId,
        productId: product._id,
      });

      setWished(true);
    } catch (err) {
      if (err.response?.data?.msg === "Already wished") {
        setWished(true);
      } else {
        console.error(err);
        alert("Error adding to wishlist");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "12px",
        margin: "10px",
        borderRadius: "8px",
      }}
    >
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
      <p>Price: ৳ {product.price}</p>
      <p>Stock: {product.stock}</p>

      {product.stock > 0 ? (
        <button
          onClick={() => onAddToCart(product._id)}
          style={{
            padding: "8px",
            backgroundColor: "green",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      ) : (
        <button
          onClick={handleAddToWishlist}
          disabled={loading || wished}
          style={{
            padding: "8px",
            backgroundColor: wished ? "gray" : "crimson",
            color: "white",
            border: "none",
            cursor: wished ? "not-allowed" : "pointer",
          }}
        >
          {wished ? "❤️ Added to Wishlist" : "❤️ Add to Wishlist"}
        </button>
      )}
    </div>
  );
};

export default ProductCard;
