const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const {
  requestReturn,
  getSellerReturnRequests,
  decideReturnRequest,
} = require("../controllers/returnController");

const router = express.Router();

router.post(
  "/request/:orderId",
  isLoggedIn,
  authorizeRoles("customer"),
  requestReturn
);

router.get(
  "/seller",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerReturnRequests
);

router.put(
  "/:returnRequestId/decision",
  isLoggedIn,
  authorizeRoles("seller"),
  decideReturnRequest
);

module.exports = router;
