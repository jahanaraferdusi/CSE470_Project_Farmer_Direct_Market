const User = require("../models/User");
const GiftCard = require("../models/GiftCard");

// Get Wallet
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      wallet: user.wallet
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Money
exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Please enter a valid amount" });
    }

    const user = await User.findById(req.user.id);

    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] };
    }

    user.wallet.balance += Number(amount);

    user.wallet.transactions.push({
      type: "ADD_MONEY",
      amount: Number(amount)
    });

    await user.save();

    res.json({
      success: true,
      message: "Money added successfully",
      wallet: user.wallet
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add Gift Card to Wallet
exports.addGiftCardToWallet = async (req, res) => {
  try {
    const { code } = req.body;

    const gift = await GiftCard.findOne({ code });

    if (!gift || gift.isUsed) {
      return res.status(400).json({ message: "Invalid or used gift card" });
    }

    const user = await User.findById(req.user.id);

    if (!user.wallet) {
      user.wallet = { balance: 0, transactions: [] };
    }

    user.wallet.balance += Number(gift.amount);

    user.wallet.transactions.push({
      type: "GIFT_CARD",
      amount: Number(gift.amount)
    });

    gift.isUsed = true;

    await gift.save();
    await user.save();

    res.json({
      success: true,
      message: "Gift card added to wallet successfully",
      wallet: user.wallet
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};