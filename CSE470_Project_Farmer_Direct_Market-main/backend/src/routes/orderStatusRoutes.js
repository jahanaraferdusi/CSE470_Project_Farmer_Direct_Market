const express = require("express");
const router = express.Router();

const {
  updateStatus,
  getStatus
} = require("../controllers/orderStatusController");

router.post("/update", updateStatus);
router.get("/:orderId", getStatus);

module.exports = router;