const express = require("express");
const {
  isLoggedIn,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const {
  getMyProfile,
  getAllUsers,
  banUser,
  unbanUser,
  applyReferralCode,
} = require("../controllers/userController");

const router = express.Router();

router.get("/me", isLoggedIn, getMyProfile);
router.get("/", isLoggedIn, authorizeRoles("admin"), getAllUsers);
router.put("/ban/:userId", isLoggedIn, authorizeRoles("admin"), banUser);
router.put("/unban/:userId", isLoggedIn, authorizeRoles("admin"), unbanUser);
router.post("/apply-referral", isLoggedIn, applyReferralCode);

module.exports = router;