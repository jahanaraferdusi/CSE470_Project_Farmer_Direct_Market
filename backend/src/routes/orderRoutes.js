const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  checkout,
  getMyOrders,
  getSellerDeliverySlots,
  getAdminDeliverySlots,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/my-orders", isLoggedIn, authorizeRoles("customer"), getMyOrders);

router.get(
  "/seller/delivery-slots",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerDeliverySlots
);

router.get(
  "/admin/delivery-slots",
  isLoggedIn,
  authorizeRoles("admin"),
  getAdminDeliverySlots
);

router.post("/checkout", isLoggedIn, authorizeRoles("customer"), checkout);

module.exports = router;