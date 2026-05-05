const express = require("express");
const router = express.Router();

const {
  updateStatus,
  getStatus,
} = require("../controllers/orderStatusController");

router.get("/:orderId", getStatus);
router.put("/:orderId", updateStatus);

module.exports = router;