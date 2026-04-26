import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../services/api";

const ProductReview = () => {
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [replyText, setReplyText] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isCustomer = user?.role === "customer";
  const isSeller = user?.role === "seller";

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setMessage("");

      const res = await API.get(`/reviews/product/${productId}`);

      setProduct(res.data.product || null);
      setReviews(Array.isArray(res.data.reviews) ? res.data.reviews : []);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to load product reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const reviewStats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        count: 0,
        average: 0,
      };
    }

    const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);

    return {
      count: reviews.length,
      average: (total / reviews.length).toFixed(1),
    };
  }, [reviews]);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!isCustomer) {
      setMessage("Only customers can give reviews.");
      return;
    }

    try {
      const res = await API.post(`/reviews/${productId}`, {
        rating: Number(rating),
        comment,
      });

      setMessage(res.data.message || "Review saved successfully.");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Review failed.");
    }
  };

  const submitReply = async (reviewId) => {
    const text = replyText[reviewId];

    if (!text || !text.trim()) {
      setMessage("Please write a reply first.");
      return;
    }

    try {
      const res = await API.put(`/reviews/${reviewId}/reply`, {
        text: text.trim(),
      });

      setMessage(res.data.message || "Reply saved successfully.");
      setReplyText({ ...replyText, [reviewId]: "" });
      fetchReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Reply failed.");
    }
  };

  const deleteReview = async (reviewId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );

    if (!confirmDelete) return;

    try {
      const res = await API.delete(`/reviews/${reviewId}`);
      setMessage(res.data.message || "Review deleted successfully.");
      fetchReviews();
    } catch (error) {
      setMessage(error.response?.data?.message || "Delete failed.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "";

    return parsedDate.toLocaleString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const canDeleteReview = (review) => {
    const currentUserId = user?._id || user?.id;
    const reviewUserId = review.user?._id || review.user;

    return (
      user?.role === "admin" ||
      reviewUserId?.toString() === currentUserId?.toString()
    );
  };

  return (
    <div style={styles.page}>
      <section style={styles.hero}>
        <div>
          <p style={styles.kicker}>Product Reviews</p>

          <h1 style={styles.title}>
            See what people say about this product
          </h1>

          <p style={styles.subtitle}>
            Reviews are visible to everyone including visitors, customers,
            sellers, and admins. Only customers can write reviews. Sellers can
            reply to reviews for their own products.
          </p>
        </div>

        <div style={styles.heroActions}>
          <Link to="/" style={styles.homeButton}>
            Go to Home
          </Link>
        </div>
      </section>

      {message && <div style={styles.noticeBox}>{message}</div>}

      <section style={styles.summaryCard}>
        <div>
          <h2 style={styles.productTitle}>
            {product?.name || "Product Review Details"}
          </h2>

          <p style={styles.smallText}>
            {product?.category ? `Category: ${product.category}` : "Review page"}
          </p>

          {product?.seller?.name && (
            <p style={styles.smallText}>Seller: {product.seller.name}</p>
          )}
        </div>

        <div style={styles.ratingSummary}>
          <span style={styles.bigRating}>{reviewStats.average}</span>
          <span style={styles.stars}>
            {"⭐".repeat(Math.round(Number(reviewStats.average))) || "No rating"}
          </span>
          <span style={styles.smallText}>{reviewStats.count} review(s)</span>
        </div>
      </section>

      <section style={styles.contentGrid}>
        <aside style={styles.reviewFormCard}>
          <h2 style={styles.sectionTitle}>Write a Review</h2>

          {isCustomer ? (
            <form onSubmit={submitReview}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={styles.select}
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Bad</option>
                </select>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Write your review..."
                  required
                  rows="5"
                  style={styles.textarea}
                />
              </div>

              <button type="submit" style={styles.primaryButton}>
                Submit Review
              </button>
            </form>
          ) : (
            <div style={styles.infoBox}>
              <strong>Only customers can submit reviews.</strong>
              <p style={styles.infoText}>
                Visitors, sellers, and admins can read reviews. Sellers can
                reply to reviews on their own products.
              </p>

              {!user && (
                <Link to="/login" style={styles.loginLink}>
                  Login as Customer
                </Link>
              )}
            </div>
          )}
        </aside>

        <main style={styles.reviewsSection}>
          <div style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>All Reviews</h2>
              <p style={styles.smallText}>
                Public feedback and seller responses.
              </p>
            </div>

            <button type="button" onClick={fetchReviews} style={styles.refreshBtn}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div style={styles.emptyState}>Loading reviews...</div>
          ) : reviews.length === 0 ? (
            <div style={styles.emptyState}>No reviews yet.</div>
          ) : (
            <div style={styles.reviewList}>
              {reviews.map((review) => (
                <article key={review._id} style={styles.reviewCard}>
                  <div style={styles.reviewTop}>
                    <div style={styles.avatar}>
                      {(review.user?.name || "U").charAt(0).toUpperCase()}
                    </div>

                    <div style={styles.reviewTopText}>
                      <h3 style={styles.reviewerName}>
                        {review.user?.name || "Unknown User"}
                      </h3>

                      <p style={styles.smallText}>
                        {formatDate(review.createdAt)}
                      </p>
                    </div>

                    <div style={styles.reviewRating}>
                      {"⭐".repeat(Number(review.rating))}
                    </div>
                  </div>

                  <p style={styles.comment}>{review.comment}</p>

                  {review.sellerReply?.text && (
                    <div style={styles.sellerReplyBox}>
                      <strong>Seller Reply</strong>
                      <p style={styles.replyText}>{review.sellerReply.text}</p>
                      <span style={styles.replyDate}>
                        {formatDate(review.sellerReply.repliedAt)}
                      </span>
                    </div>
                  )}

                  {isSeller && (
                    <div style={styles.replyForm}>
                      <textarea
                        value={replyText[review._id] || ""}
                        onChange={(e) =>
                          setReplyText({
                            ...replyText,
                            [review._id]: e.target.value,
                          })
                        }
                        placeholder={
                          review.sellerReply?.text
                            ? "Update your seller reply..."
                            : "Reply to this review..."
                        }
                        rows="3"
                        style={styles.replyTextarea}
                      />

                      <button
                        type="button"
                        onClick={() => submitReply(review._id)}
                        style={styles.replyButton}
                      >
                        {review.sellerReply?.text ? "Update Reply" : "Reply"}
                      </button>
                    </div>
                  )}

                  {canDeleteReview(review) && (
                    <button
                      type="button"
                      onClick={() => deleteReview(review._id)}
                      style={styles.deleteButton}
                    >
                      Delete Review
                    </button>
                  )}
                </article>
              ))}
            </div>
          )}
        </main>
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    padding: "28px",
    background:
      "linear-gradient(135deg, #f0fdf4 0%, #ffffff 45%, #ecfdf5 100%)",
    color: "#1f2937",
  },

  hero: {
    maxWidth: "1180px",
    margin: "0 auto 22px",
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  kicker: {
    margin: "0 0 8px",
    color: "#15803d",
    fontWeight: "800",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontSize: "13px",
  },

  title: {
    margin: 0,
    fontSize: "38px",
    lineHeight: "1.15",
    color: "#14532d",
  },

  subtitle: {
    margin: "12px 0 0",
    maxWidth: "760px",
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.6",
  },

  heroActions: {
    display: "flex",
    gap: "10px",
  },

  homeButton: {
    background: "#15803d",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "800",
    boxShadow: "0 10px 20px rgba(21, 128, 61, 0.18)",
  },

  noticeBox: {
    maxWidth: "1180px",
    margin: "0 auto 18px",
    background: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    padding: "14px 16px",
    borderRadius: "14px",
    fontWeight: "700",
  },

  summaryCard: {
    maxWidth: "1180px",
    margin: "0 auto 22px",
    background: "#ffffff",
    border: "1px solid #dcfce7",
    borderRadius: "22px",
    padding: "22px",
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    alignItems: "center",
    flexWrap: "wrap",
    boxShadow: "0 16px 35px rgba(22, 101, 52, 0.08)",
  },

  productTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "28px",
  },

  smallText: {
    margin: "6px 0 0",
    color: "#6b7280",
    lineHeight: "1.5",
  },

  ratingSummary: {
    minWidth: "170px",
    textAlign: "center",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "18px",
    padding: "16px",
  },

  bigRating: {
    display: "block",
    color: "#14532d",
    fontSize: "38px",
    fontWeight: "900",
  },

  stars: {
    display: "block",
    marginTop: "4px",
    fontSize: "18px",
  },

  contentGrid: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "360px minmax(0, 1fr)",
    gap: "18px",
    alignItems: "start",
  },

  reviewFormCard: {
    background: "#ffffff",
    border: "1px solid #dcfce7",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 16px 35px rgba(22, 101, 52, 0.08)",
  },

  sectionTitle: {
    margin: 0,
    color: "#14532d",
    fontSize: "24px",
  },

  formGroup: {
    marginTop: "16px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#1f2937",
    fontWeight: "800",
  },

  select: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "15px",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },

  primaryButton: {
    marginTop: "16px",
    width: "100%",
    border: "none",
    background: "#15803d",
    color: "#ffffff",
    padding: "13px 16px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
  },

  infoBox: {
    marginTop: "16px",
    background: "#f9fafb",
    border: "1px dashed #86efac",
    borderRadius: "16px",
    padding: "16px",
    color: "#374151",
  },

  infoText: {
    color: "#6b7280",
    lineHeight: "1.6",
  },

  loginLink: {
    display: "inline-block",
    marginTop: "8px",
    color: "#ffffff",
    background: "#15803d",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: "800",
  },

  reviewsSection: {
    background: "#ffffff",
    border: "1px solid #dcfce7",
    borderRadius: "22px",
    padding: "22px",
    boxShadow: "0 16px 35px rgba(22, 101, 52, 0.08)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "16px",
  },

  refreshBtn: {
    border: "1px solid #bbf7d0",
    background: "#f0fdf4",
    color: "#166534",
    padding: "10px 14px",
    borderRadius: "12px",
    fontWeight: "800",
    cursor: "pointer",
  },

  emptyState: {
    background: "#f9fafb",
    border: "1px dashed #86efac",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    color: "#4b5563",
    fontWeight: "700",
  },

  reviewList: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  reviewCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    padding: "18px",
    background: "#ffffff",
  },

  reviewTop: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },

  avatar: {
    width: "48px",
    height: "48px",
    borderRadius: "999px",
    background: "#15803d",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontWeight: "900",
    flexShrink: 0,
  },

  reviewTopText: {
    flex: 1,
  },

  reviewerName: {
    margin: 0,
    color: "#1f2937",
    fontSize: "18px",
  },

  reviewRating: {
    color: "#f59e0b",
    fontSize: "16px",
    whiteSpace: "nowrap",
  },

  comment: {
    margin: "14px 0 0",
    color: "#374151",
    lineHeight: "1.7",
  },

  sellerReplyBox: {
    marginTop: "14px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "14px",
    padding: "14px",
    color: "#14532d",
  },

  replyText: {
    margin: "8px 0",
    color: "#374151",
    lineHeight: "1.6",
  },

  replyDate: {
    color: "#6b7280",
    fontSize: "13px",
  },

  replyForm: {
    marginTop: "14px",
    display: "grid",
    gap: "10px",
  },

  replyTextarea: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    fontSize: "15px",
    resize: "vertical",
    fontFamily: "inherit",
  },

  replyButton: {
    justifySelf: "start",
    border: "none",
    background: "#15803d",
    color: "#ffffff",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: "900",
    cursor: "pointer",
  },

  deleteButton: {
    marginTop: "14px",
    border: "1px solid #fecaca",
    background: "#fee2e2",
    color: "#991b1b",
    padding: "9px 12px",
    borderRadius: "10px",
    fontWeight: "800",
    cursor: "pointer",
  },
};

export default ProductReview;