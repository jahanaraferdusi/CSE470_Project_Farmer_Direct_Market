const express = require("express");

const {
  addOrUpdateReview,
  getProductReviews,
  replyToReview,
  deleteReview,
  getSellerProductReviews,
} = require("../controllers/reviewController");

const { isLoggedIn, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post(
  "/:productId",
  isLoggedIn,
  authorizeRoles("customer"),
  addOrUpdateReview
);

router.put(
  "/:reviewId/reply",
  isLoggedIn,
  authorizeRoles("seller"),
  replyToReview
);

router.get(
  "/seller/my-products",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerProductReviews
);

router.delete("/:reviewId", isLoggedIn, deleteReview);

module.exports = router;