import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/products/${productId}`);
      setProduct(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to load product.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    try {
      await API.post("/cart", {
        productId: product._id,
        quantity: 1,
      });

      setMessage("Product added to cart successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add to cart.");
    }
  };

  const handleAddToCompare = async () => {
    try {
      await API.post("/compare/add", {
        productId: product._id,
      });

      navigate("/compare");
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to add product to compare."
      );
    }
  };

  if (loading) {
    return <div className="empty-state">Loading product...</div>;
  }

  if (!product) {
    return <div className="empty-state">{message || "Product not found."}</div>;
  }

  return (
    <div className="page-container" style={{ maxWidth: "900px" }}>
      <div className="page-header">
        <h1 className="page-title">Product Details</h1>
        <p className="page-subtitle">
          View product information and add it to cart or compare list.
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

      <div className="page-card">
        <div
          style={{
            minHeight: "180px",
            background: "#f3f8ef",
            borderRadius: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#245c2f",
            fontWeight: "800",
            fontSize: "28px",
            textAlign: "center",
            padding: "20px",
          }}
        >
          {product.name}
        </div>

        <h2 className="card-title">{product.name}</h2>

        <p style={{ color: "#607064" }}>
          <strong>Category:</strong> {product.category || "N/A"}
        </p>

        <p style={{ color: "#607064" }}>
          <strong>Description:</strong> {product.description || "N/A"}
        </p>

        <p style={{ color: "#607064" }}>
          <strong>Price:</strong> ৳ {product.price}
        </p>

        <p style={{ color: "#607064" }}>
          <strong>Stock:</strong> {product.stock}
        </p>

        <p style={{ color: "#607064" }}>
          <strong>Expiry Date:</strong>{" "}
          {product.expiryDate
            ? new Date(product.expiryDate).toLocaleDateString()
            : "N/A"}
        </p>

        <p style={{ color: "#607064" }}>
          <strong>Seller:</strong> {product.seller?.name || "N/A"}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="primary-btn"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
          >
            Add to Cart
          </button>

          <button
            type="button"
            className="secondary-btn"
            onClick={handleAddToCompare}
          >
            Add to Compare
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;