const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  addToCart,
  getMyCart,
  updateCartQuantity,
  removeFromCart,
} = require("../controllers/cartController");

const router = express.Router();

router.get("/", isLoggedIn, authorizeRoles("customer"), getMyCart);
router.post("/", isLoggedIn, authorizeRoles("customer"), addToCart);
router.put("/:productId", isLoggedIn, authorizeRoles("customer"), updateCartQuantity);
router.delete("/:productId", isLoggedIn, authorizeRoles("customer"), removeFromCart);

module.exports = router;
