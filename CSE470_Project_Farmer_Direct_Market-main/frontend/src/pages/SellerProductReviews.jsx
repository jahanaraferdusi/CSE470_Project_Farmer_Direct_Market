import { useEffect, useState } from "react";
import API from "../services/api";

const SellerProductReviews = () => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews/seller/my-products");
      setReviews(res.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Reviews</h2>

      {reviews.length === 0 ? (
        <p>No reviews found.</p>
      ) : (
        reviews.map((review) => (
          <div
            key={review._id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{review.product?.name}</h3>
            <p>Customer: {review.user?.name}</p>
            <p>Rating: {"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default SellerProductReviews;