const express = require("express");
const {
  createGiftCard,
  getMyGiftCards,
  validateGiftCard,
  redeemGiftCard,
  disableGiftCard,
  getGiftCardLimits,
} = require("../controllers/giftCardController");

const { isLoggedIn, authorizeRoles } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/limits", getGiftCardLimits);

router.post("/", isLoggedIn, authorizeRoles("customer"), createGiftCard);

router.get("/my", isLoggedIn, authorizeRoles("customer"), getMyGiftCards);

router.get("/validate/:code", isLoggedIn, validateGiftCard);

router.post("/redeem", isLoggedIn, redeemGiftCard);

router.delete("/:id", isLoggedIn, authorizeRoles("customer"), disableGiftCard);

module.exports = router;