const User = require("../models/User");

const getPendingSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({
      role: "seller",
      sellerVerified: false,
    }).select("-password");

    res.status(200).json(sellers);
  } catch (error) {
    next(error);
  }
};

const verifySeller = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    const seller = await User.findById(sellerId);
    if (!seller) {
      return res.status(404).json({ message: "Seller not found" });
    }

    if (seller.role !== "seller") {
      return res.status(400).json({ message: "User is not a seller" });
    }

    seller.sellerVerified = true;
    await seller.save();

    res.status(200).json({
      message: "Seller verified successfully",
      seller,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPendingSellers,
  verifySeller,
};
