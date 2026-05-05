import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

const ProductCard = ({ product, onAddToCart }) => {
  const [loading, setLoading] = useState(false);
  const [wished, setWished] = useState(false);

  const userId = localStorage.getItem("userId");
  const isOutOfStock = product.stock <= 0;

  const handleAddToWishlist = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      setLoading(true);

      await API.post("/wishlist/add", {
        userId,
        productId: product._id,
      });

      setWished(true);
    } catch (err) {
      alert("Error adding to wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    try {
      await API.post("/compare/add", {
        productId: product._id,
      });
      alert("Added to compare");
    } catch (err) {
      alert("Compare failed");
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <div>{product.name}</div>
      </Link>

      <p>৳ {product.price}</p>

      <button onClick={() => onAddToCart(product._id)}>
        Add to Cart
      </button>

      <button onClick={handleCompare}>Compare</button>

      <button onClick={handleAddToWishlist}>
        {wished ? "❤️ Added" : "❤️ Wishlist"}
      </button>

      <Link to={`/products/${product._id}/reviews`}>
        Reviews
      </Link>
    </div>
  );
};

export default ProductCard;