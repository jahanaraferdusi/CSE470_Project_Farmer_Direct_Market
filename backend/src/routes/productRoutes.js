const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  addProduct,
  getAllProducts,
<<<<<<< HEAD
  getProductById,
=======
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
  updateStock,
  getSellerProducts,
  getSellerSpoilageAlerts,
  getDiscountedProducts,
} = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);
<<<<<<< HEAD
router.get("/discounted", getDiscountedProducts);
router.get("/:productId", getProductById);

=======

// seller spoilage alerts
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
router.get(
  "/seller/spoilage-alerts",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerSpoilageAlerts
);

<<<<<<< HEAD
=======
// seller views own products
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
router.get(
  "/seller/:sellerId",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerProducts
);

<<<<<<< HEAD
router.post("/", isLoggedIn, authorizeRoles("seller"), addProduct);

router.put(
  "/:productId/stock",
  isLoggedIn,
  authorizeRoles("seller"),
  updateStock
);

module.exports = router;
=======
// seller adds product
router.post("/", isLoggedIn, authorizeRoles("seller"), addProduct);

// seller updates stock and expiry
router.put("/:productId/stock", isLoggedIn, authorizeRoles("seller"), updateStock);

// seller can get discounts
router.get("/discounted", getDiscountedProducts);

module.exports = router;
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
