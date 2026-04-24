const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  addProduct,
  getAllProducts,
  updateStock,
  getSellerProducts,
  getSellerSpoilageAlerts,
<<<<<<< HEAD
  getDiscountedProducts,
=======
>>>>>>> fb62d7f298be7aa7d970834080bbe89182acfd69
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);

// seller spoilage alerts
router.get(
  "/seller/spoilage-alerts",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerSpoilageAlerts
);

// seller views own products
router.get(
  "/seller/:sellerId",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerProducts
);

// seller adds product
router.post("/", isLoggedIn, authorizeRoles("seller"), addProduct);

// seller updates stock and expiry
router.put("/:productId/stock", isLoggedIn, authorizeRoles("seller"), updateStock);

<<<<<<< HEAD
// seller can get discounts
router.get("/discounted", getDiscountedProducts);

=======
>>>>>>> fb62d7f298be7aa7d970834080bbe89182acfd69
module.exports = router;
