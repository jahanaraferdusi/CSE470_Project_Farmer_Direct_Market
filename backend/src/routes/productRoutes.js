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

router.get("/", getAllProducts);
router.get("/discounted", getDiscountedProducts);
router.get("/:productId", getProductById);

router.get(
  "/seller/spoilage-alerts",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerSpoilageAlerts
);

router.get(
  "/seller/:sellerId",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerProducts
);

router.post("/", isLoggedIn, authorizeRoles("seller"), addProduct);

router.put(
  "/:productId/stock",
  isLoggedIn,
  authorizeRoles("seller"),
  updateStock
);

module.exports = router;