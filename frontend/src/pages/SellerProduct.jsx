import React, { useEffect, useState } from "react";
import API from "../services/api";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sellerId = localStorage.getItem("userId");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.get(`/products/seller/${sellerId}`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sellerId) {
      fetchProducts();
    }
  }, [sellerId]);

  if (!sellerId) {
    return (
      <div className="page-container">
        <div className="empty-state">Please login as a seller first.</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Products</h1>
        <p className="page-subtitle">
          View your listed products, stock levels, and customer wishlist demand.
        </p>
      </div>

      {message && <div className="error-box">{message}</div>}

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="card-grid">
          {products.map((product) => {
            const highDemand =
              product.wishlistCount > 5 && Number(product.stock) === 0;

            return (
              <div key={product._id} className="pretty-card">
                <div
                  style={{
                    minHeight: "110px",
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

                <h3 style={{ color: "#245c2f", marginTop: 0 }}>
                  {product.name}
                </h3>

                <p>
                  <strong>Category:</strong> {product.category || "N/A"}
                </p>
                <p>
                  <strong>Price:</strong> ৳ {product.price}
                </p>
                <p>
                  <strong>Stock:</strong> {product.stock}
                </p>

                <div className="info-box" style={{ marginBottom: 0 }}>
                  <strong>❤️ Wishlist Count:</strong>{" "}
                  {product.wishlistCount || 0}
                </div>

                {highDemand && (
                  <div className="success-box" style={{ marginTop: "14px" }}>
                    High demand! Consider restocking this product.
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

export default SellerProducts;