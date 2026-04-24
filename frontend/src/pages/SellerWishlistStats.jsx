import React, { useEffect, useState } from "react";
import axios from "axios";

const SellerWishlistStats = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchStats = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.get(
        `http://localhost:5000/api/wishlist/seller/${user._id}`
      );

      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.msg || "Failed to load wishlist stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchStats();
    }
  }, []);

  if (!user) {
    return (
      <div className="page-container">
        <div className="empty-state">Please login first.</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Wishlist Stats</h1>
        <p className="page-subtitle">
          See which products customers want most and use that to plan restocking.
        </p>
      </div>

      {message && <div className="error-box">{message}</div>}

      {loading ? (
        <div className="empty-state">Loading wishlist stats...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="card-grid">
          {products.map((product) => {
            const wishlistCount = product.wishlistCount || 0;
            const highDemand = wishlistCount >= 5;

            return (
              <div key={product._id} className="pretty-card">
                <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                  {product.name}
                </h3>

                <p>
                  <strong>Price:</strong> ৳ {product.price}
                </p>
                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>

                <div className="info-box" style={{ marginBottom: 0 }}>
                  <strong>Total wished by customers:</strong> {wishlistCount}
                </div>

                {highDemand && (
                  <div className="success-box" style={{ marginTop: "14px" }}>
                    High interest product. Consider increasing stock.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerWishlistStats;