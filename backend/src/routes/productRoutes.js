const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  addProduct,
  getAllProducts,
  getProductById,
  updateStock,
  getSellerProducts,
  getSellerSpoilageAlerts,
  getDiscountedProducts,
} = require("../controllers/productController");

const router = express.Router();

// ✅ Public routes
router.get("/", getAllProducts);
router.get("/discounted", getDiscountedProducts);
router.get("/:productId", getProductById);

// ✅ Seller: spoilage alerts
router.get(
  "/seller/spoilage-alerts",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerSpoilageAlerts
);

// ✅ Seller: view own products
router.get(
  "/seller/:sellerId",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerProducts
);

// ✅ Seller: add product
router.post(
  "/",
  isLoggedIn,
  authorizeRoles("seller"),
  addProduct
);

// ✅ Seller: update stock & expiry
router.put(
  "/:productId/stock",
  isLoggedIn,
  authorizeRoles("seller"),
  updateStock
);

module.exports = router;