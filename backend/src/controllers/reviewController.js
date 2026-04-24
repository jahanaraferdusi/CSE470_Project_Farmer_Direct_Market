const createError = require("http-errors");
const Review = require("../models/Review");
const Product = require("../models/Product");

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const reviewCount = reviews.length;

  const averageRating =
    reviewCount === 0
      ? 0
      : reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Number(averageRating.toFixed(1)),
    reviewCount,
  });
};

const addOrUpdateReview = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      throw createError(400, "Rating and comment are required");
    }

    if (rating < 1 || rating > 5) {
      throw createError(400, "Rating must be between 1 and 5");
    }

    const product = await Product.findById(productId);

    if (!product) {
      throw createError(404, "Product not found");
    }

    let review = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (review) {
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = await Review.create({
        product: productId,
        user: req.user._id,
        rating,
        comment,
      });
    }

    await updateProductRating(productId);

    res.status(201).json({
      success: true,
      message: "Review saved successfully",
      review,
    });
  } catch (error) {
    next(error);
  }
};

const getProductReviews = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      throw createError(404, "Review not found");
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      throw createError(403, "You are not allowed to delete this review");
    }

    const productId = review.product;

    await Review.findByIdAndDelete(reviewId);
    await updateProductRating(productId);

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getSellerProductReviews = async (req, res, next) => {
  try {
    const sellerProducts = await Product.find({ seller: req.user._id }).select(
      "_id"
    );

    const productIds = sellerProducts.map((product) => product._id);

    const reviews = await Review.find({ product: { $in: productIds } })
      .populate("user", "name email")
      .populate("product", "name price image averageRating reviewCount")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addOrUpdateReview,
  getProductReviews,
  deleteReview,
  getSellerProductReviews,
};