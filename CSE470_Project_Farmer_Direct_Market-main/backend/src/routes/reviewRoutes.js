const express = require("express");
const {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
  getSellerProductReviews,
} = require("../controllers/reviewController");

const { isLoggedIn, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post(
  "/:productId",
  isLoggedIn,
  authorizeRoles("customer"),
  addOrUpdateReview
);

router.get("/product/:productId", getProductReviews);

router.get(
  "/seller/my-products",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerProductReviews
);

router.delete("/:reviewId", isLoggedIn, deleteReview);

module.exports = router;