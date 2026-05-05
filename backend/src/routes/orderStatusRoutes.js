const express = require("express");
const router = express.Router();

const {
  updateStatus,
  getStatus
} = require("../controllers/orderStatusController");

// ✅ Get order status
router.get("/:orderId", getStatus);

// ✅ Update order status
router.put("/:orderId", updateStatus);

module.exports = router;