import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Compare = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext); // ✅ logged-in user

  useEffect(() => {
    if (user?._id) {
      fetchCompare();
    }
  }, [user]);

  const fetchCompare = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/compare/${user._id}`
      );

      setProducts(res.data || []);
    } catch (err) {
      console.error("Compare fetch error:", err);
      setProducts([]);
    }
  };

  if (!user) {
    return <p>Please login to see comparison.</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Compare Products</h2>

      {products.length === 0 ? (
        <p>No products to compare</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Final Price</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.discount}</td>
                <td>{p.finalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Compare;