import React, { useEffect, useState } from "react";
import axios from "axios";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId) {
      fetchWishlist();
    }
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/wishlist/${userId}`);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.post("/api/wishlist/remove", {
        userId,
        productId,
      });
      fetchWishlist();
    } catch (err) {
      console.error(err);
    }
  };

  if (!userId) {
    return <h2>Please login to view wishlist</h2>;
  }

  return (
    <div>
      <h2>My Wishlist</h2>

      {items.length === 0 ? (
        <p>No wishlist items yet</p>
      ) : (
        items.map((item) => (
          <div key={item._id} style={{ border: "1px solid #ccc", margin: 10 }}>
            <img src={item.product?.image} width="100" alt={item.product?.name} />
            <h3>{item.product?.name}</h3>
            <p>৳{item.product?.price}</p>

            <button onClick={() => removeItem(item.product._id)}>
              Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Wishlist;