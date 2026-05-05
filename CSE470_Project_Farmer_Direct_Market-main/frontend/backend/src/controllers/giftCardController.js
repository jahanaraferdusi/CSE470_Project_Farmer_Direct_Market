const GiftCard = require("../models/GiftCard");

const MIN_AMOUNT = 5;
const MAX_AMOUNT = 200;
const MAX_ACTIVE_GIFT_CARDS = 5;

const generateGiftCardCode = () => {
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FDM-${randomPart}`;
};

const generateUniqueGiftCardCode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = generateGiftCardCode();
    exists = await GiftCard.findOne({ code });
  }

  return code;
};

const createGiftCard = async (req, res) => {
  try {
    const { recipientName, recipientEmail, amount, message } = req.body;

    if (!recipientName || !recipientEmail || !amount) {
      return res.status(400).json({
        message: "Recipient name, recipient email, and amount are required.",
      });
    }

    const giftAmount = Number(amount);

    if (giftAmount < MIN_AMOUNT) {
      return res.status(400).json({
        message: `Gift card amount must be at least $${MIN_AMOUNT}.`,
      });
    }

    if (giftAmount > MAX_AMOUNT) {
      return res.status(400).json({
        message: `Gift card amount cannot exceed $${MAX_AMOUNT}.`,
      });
    }

    const activeGiftCards = await GiftCard.countDocuments({
      customer: req.user._id,
      status: "active",
    });

    if (activeGiftCards >= MAX_ACTIVE_GIFT_CARDS) {
      return res.status(400).json({
        message: `You can only have ${MAX_ACTIVE_GIFT_CARDS} active gift cards.`,
      });
    }

    const code = await generateUniqueGiftCardCode();

    const giftCard = await GiftCard.create({
      customer: req.user._id,
      recipientName,
      recipientEmail,
      amount: giftAmount,
      balance: giftAmount,
      message: message || "",
      code,
      status: "active",
    });

    res.status(201).json({
      message: "Gift card created successfully.",
      giftCard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create gift card.",
      error: error.message,
    });
  }
};

const getMyGiftCards = async (req, res) => {
  try {
    const giftCards = await GiftCard.find({ customer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(giftCards);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gift cards.",
      error: error.message,
    });
  }
};

const validateGiftCard = async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();

    const giftCard = await GiftCard.findOne({ code });

    if (!giftCard) {
      return res.status(404).json({
        valid: false,
        message: "Gift card not found.",
      });
    }

    if (giftCard.status !== "active") {
      return res.status(400).json({
        valid: false,
        message: `Gift card is ${giftCard.status}.`,
        giftCard,
      });
    }

    if (giftCard.balance <= 0) {
      giftCard.status = "used";
      await giftCard.save();

      return res.status(400).json({
        valid: false,
        message: "Gift card has no remaining balance.",
        giftCard,
      });
    }

    res.status(200).json({
      valid: true,
      message: "Gift card is valid.",
      giftCard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to validate gift card.",
      error: error.message,
    });
  }
};

const redeemGiftCard = async (req, res) => {
  try {
    const { code, amount } = req.body;

    if (!code || !amount) {
      return res.status(400).json({
        message: "Gift card code and amount are required.",
      });
    }

    const redeemAmount = Number(amount);

    if (redeemAmount <= 0) {
      return res.status(400).json({
        message: "Redeem amount must be greater than 0.",
      });
    }

    const giftCard = await GiftCard.findOne({
      code: code.toUpperCase().trim(),
    });

    if (!giftCard) {
      return res.status(404).json({
        message: "Gift card not found.",
      });
    }

    if (giftCard.status !== "active") {
      return res.status(400).json({
        message: `Gift card is ${giftCard.status}.`,
      });
    }

    if (giftCard.balance < redeemAmount) {
      return res.status(400).json({
        message: "Gift card balance is not enough.",
        balance: giftCard.balance,
      });
    }

    giftCard.balance -= redeemAmount;

    if (giftCard.balance === 0) {
      giftCard.status = "used";
    }

    await giftCard.save();

    res.status(200).json({
      message: "Gift card redeemed successfully.",
      giftCard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to redeem gift card.",
      error: error.message,
    });
  }
};

const disableGiftCard = async (req, res) => {
  try {
    const giftCard = await GiftCard.findOne({
      _id: req.params.id,
      customer: req.user._id,
    });

    if (!giftCard) {
      return res.status(404).json({
        message: "Gift card not found.",
      });
    }

    if (giftCard.status !== "active") {
      return res.status(400).json({
        message: "Only active gift cards can be disabled.",
      });
    }

    giftCard.status = "disabled";
    await giftCard.save();

    res.status(200).json({
      message: "Gift card disabled successfully.",
      giftCard,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to disable gift card.",
      error: error.message,
    });
  }
};

const getGiftCardLimits = (req, res) => {
  res.status(200).json({
    minAmount: MIN_AMOUNT,
    maxAmount: MAX_AMOUNT,
    maxActiveGiftCards: MAX_ACTIVE_GIFT_CARDS,
  });
};

module.exports = {
  createGiftCard,
  getMyGiftCards,
  validateGiftCard,
  redeemGiftCard,
  disableGiftCard,
  getGiftCardLimits,
};