const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  createPoll,
  getSellerPolls,
  getActivePolls,
  votePoll,
  updatePoll,
  resetPoll,
  deletePoll,
} = require("../controllers/pollController");

const router = express.Router();

router.get("/", isLoggedIn, authorizeRoles("customer"), getActivePolls);

router.post("/", isLoggedIn, authorizeRoles("seller"), createPoll);

router.get(
  "/seller/my-polls",
  isLoggedIn,
  authorizeRoles("seller"),
  getSellerPolls
);

router.post(
  "/:pollId/vote",
  isLoggedIn,
  authorizeRoles("customer"),
  votePoll
);

router.put(
  "/:pollId",
  isLoggedIn,
  authorizeRoles("seller"),
  updatePoll
);

router.put(
  "/:pollId/reset",
  isLoggedIn,
  authorizeRoles("seller"),
  resetPoll
);

router.delete(
  "/:pollId",
  isLoggedIn,
  authorizeRoles("seller"),
  deletePoll
);

module.exports = router;