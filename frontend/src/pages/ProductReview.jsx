import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

const ProductReview = () => {
  const { productId } = useParams();

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");

  const fetchReviews = async () => {
    try {
      const res = await API.get(`/reviews/product/${productId}`);
      setReviews(res.data.reviews);
    } catch (error) {
      console.log(error);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post(`/reviews/${productId}`, {
        rating,
        comment,
      });

      setMessage(res.data.message);
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Review failed");
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product Reviews</h2>

      <form onSubmit={submitReview}>
        <div>
          <label>Rating</label>
          <br />
          <select value={rating} onChange={(e) => setRating(e.target.value)}>
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Average</option>
            <option value="2">2 - Poor</option>
            <option value="1">1 - Bad</option>
          </select>
        </div>

        <br />

        <div>
          <label>Comment</label>
          <br />
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review"
            required
            rows="4"
            cols="40"
          />
        </div>

        <br />

        <button type="submit">Submit Review</button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      <h3>All Reviews</h3>

      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
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
            <h4>{review.user?.name}</h4>
            <p>Rating: {"⭐".repeat(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default ProductReview;