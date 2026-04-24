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

  const fetchProducts = async () => {
    try {
      const params = {};

      if (search.trim()) params.search = search.trim();
      if (category.trim()) params.category = category.trim();
      if (minPrice !== "") params.minPrice = minPrice;
      if (maxPrice !== "") params.maxPrice = maxPrice;
      if (sort) params.sort = sort;
      if (inStock) params.inStock = true;

      const res = await API.get("/products", { params });
      setProducts(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add to cart");
    }
  };

  return (
    <div>
      <h2>Available Products</h2>

      <div style={{ marginBottom: "20px", display: "grid", gap: "10px", maxWidth: "500px" }}>
        <input
          type="text"
          placeholder="Search by name, category, description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
          <option value="stock">Stock: High to Low</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />{" "}
          In stock only
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={fetchProducts}>Apply Filters</button>
          <button
            onClick={() => {
              setSearch("");
              setCategory("");
              setMinPrice("");
              setMaxPrice("");
              setSort("");
              setInStock(false);
              setTimeout(fetchProducts, 0);
            }}
          >
            Reset
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))
      )}
    </div>
  );
};

export default Home;
