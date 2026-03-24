import React from "react";
const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "12px", margin: "10px" }}>
      <h3>{product.name}</h3>
      <p>Category: {product.category}</p>
      <p>Price: ৳ {product.price}</p>
      <p>Stock: {product.stock}</p>
      <button onClick={() => onAddToCart(product._id)}>Add to Cart</button>
    </div>
  );
};

export default ProductCard;