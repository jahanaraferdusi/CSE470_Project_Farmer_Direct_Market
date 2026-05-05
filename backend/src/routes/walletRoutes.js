const express = require("express");
const {
  addMoney,
  addGiftCardToWallet,
  getWallet,
} = require("../controllers/walletController");

const { isLoggedIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", isLoggedIn, getWallet);
router.post("/add-money", isLoggedIn, addMoney);
router.post("/add-gift-card", isLoggedIn, addGiftCardToWallet);

module.exports = router;