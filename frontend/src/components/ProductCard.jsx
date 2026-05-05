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
    <div className="product-card">
      <Link
        to={`/products/${product._id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div
          style={{
            minHeight: "120px",
            background: "#f3f8ef",
            borderRadius: "14px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#245c2f",
            fontWeight: "800",
            fontSize: "18px",
            textAlign: "center",
            padding: "14px",
          }}
        >
          {product.name}
        </div>
      </Link>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <h3 style={{ margin: "0 0 8px", color: "#245c2f" }}>
          {product.name}
        </h3>

        <span
          style={{
            background: isOutOfStock ? "#ffebee" : "#e8f5e9",
            color: isOutOfStock ? "#b71c1c" : "#1b5e20",
            padding: "5px 9px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: "800",
            height: "fit-content",
            whiteSpace: "nowrap",
          }}
        >
          {isOutOfStock ? "Out of Stock" : "In Stock"}
        </span>
      </div>

      <p style={{ margin: "8px 0", color: "#607064" }}>
        <strong>Category:</strong> {product.category || "N/A"}
      </p>

      {product.description && (
        <p style={{ margin: "8px 0", color: "#607064" }}>
          {product.description}
        </p>
      )}

      <div style={{ margin: "14px 0" }}>
        <span
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#245c2f",
          }}
        >
          ৳ {product.price}
        </span>

        {product.isDiscounted && product.originalPrice ? (
          <>
            <span
              style={{
                textDecoration: "line-through",
                color: "#777",
                marginLeft: "8px",
              }}
            >
              ৳ {product.originalPrice}
            </span>

            <span
              style={{
                color: "#c62828",
                fontWeight: "800",
                marginLeft: "8px",
                fontSize: "13px",
              }}
            >
              {product.discountPercentage}% OFF
            </span>
          </>
        ) : null}
      </div>

      <p style={{ margin: "8px 0 16px", color: "#607064" }}>
        <strong>Available Stock:</strong> {product.stock}
      </p>

      {product.expiryDate && (
        <p style={{ margin: "8px 0 16px", color: "#607064" }}>
          <strong>Expiry:</strong>{" "}
          {new Date(product.expiryDate).toLocaleDateString()}
        </p>
      )}

      {product.stock > 0 ? (
        <button
          type="button"
          className="primary-btn"
          onClick={() => onAddToCart(product._id)}
          style={{ width: "100%" }}
        >
          Add to Cart
        </button>
      ) : (
        <button
          type="button"
          className={wished ? "secondary-btn" : "danger-btn"}
          onClick={handleAddToWishlist}
          disabled={loading || wished}
          style={{ width: "100%" }}
        >
          {loading
            ? "Adding..."
            : wished
            ? "❤️ Added to Wishlist"
            : "❤️ Add to Wishlist"}
        </button>
      )}

      <Link
        to={`/products/${product._id}`}
        className="secondary-btn"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        View Product
      </Link>

      <Link
        to={`/products/${product._id}/reviews`}
        className="secondary-btn"
        style={{
          display: "block",
          textAlign: "center",
          marginTop: "10px",
        }}
      >
        Reviews
      </Link>
    </div>
  );
};

export default ProductCard;