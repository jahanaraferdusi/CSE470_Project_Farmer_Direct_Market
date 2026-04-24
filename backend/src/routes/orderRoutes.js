const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { checkout, getMyOrders } = require("../controllers/orderController");

const router = express.Router();

router.get("/my-orders", isLoggedIn, authorizeRoles("customer"), getMyOrders);
router.post("/checkout", isLoggedIn, authorizeRoles("customer"), checkout);

module.exports = router;
