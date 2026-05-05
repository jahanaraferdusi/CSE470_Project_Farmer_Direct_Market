import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddToCart }) => {
  const [loading, setLoading] = useState(false);
  const [wished, setWished] = useState(false);

  const userId = localStorage.getItem("userId");
  const user = JSON.parse(localStorage.getItem("user"));
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
const handleChatWithSeller = async () => {
  if (!userId) {
    alert("Please login first");
    return;
  }

  try {
    setLoading(true);

    await axios.post(
      "http://localhost:5000/api/chats/send",
      {
        productId: product._id,
        text: `Hi, I am interested in your product: ${product.name}`,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert("Chat started successfully");
    window.location.href = "/chat";
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to start chat");
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
      <p>
           Rating: {product.averageRating || 0} ⭐ ({product.reviewCount || 0} reviews)
      </p>

    <Link to={`/reviews/${product._id}`}>
          <button>Review Product</button>
    </Link>
    {user?.role === "customer" && (
  <button
    onClick={handleChatWithSeller}
    disabled={loading}
    style={{
      padding: "8px",
      backgroundColor: "blue",
      color: "white",
      border: "none",
      cursor: "pointer",
      marginLeft: "5px",
    }}
  >
    Chat with Seller
  </button>
)}
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
