import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");
  const [inStock, setInStock] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchProducts = async (overrideReset = false) => {
    try {
      setLoading(true);
      setMessage("");

      const params = {};

      if (!overrideReset) {
        if (search.trim()) params.search = search.trim();
        if (category.trim()) params.category = category.trim();
        if (minPrice !== "") params.minPrice = minPrice;
        if (maxPrice !== "") params.maxPrice = maxPrice;
        if (sort) params.sort = sort;
        if (inStock) params.inStock = true;
      }

      const res = await API.get("/products", { params });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      setMessage("Product added to cart successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to add to cart.");
    }
  };

  const handleReset = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSort("");
    setInStock(false);
    fetchProducts(true);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Available Products</h1>
        <p className="page-subtitle">
          Browse fresh farm products directly from local sellers.
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
        <h2 className="card-title">Search & Filter Products</h2>

        <div className="form-grid">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Search</label>
              <input
                className="form-input"
                type="text"
                placeholder="Search by name, category, or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                className="form-input"
                type="text"
                placeholder="Example: Fruits, Vegetables"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Minimum Price</label>
              <input
                className="form-input"
                type="number"
                placeholder="Min price"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Maximum Price</label>
              <input
                className="form-input"
                type="number"
                placeholder="Max price"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sort By</label>
              <select
                className="form-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Default</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
                <option value="stock">Stock: High to Low</option>
              </select>
            </div>
          </div>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "700",
              color: "#34443a",
            }}
          >
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
            />
            Show in-stock products only
          </label>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary-btn"
              onClick={() => fetchProducts()}
              disabled={loading}
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">No products found.</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;