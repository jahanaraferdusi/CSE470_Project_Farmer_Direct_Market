const User = require("../models/User");

const createReferralCode = (name = "USER") => {
  const prefix = name
    .replace(/[^a-zA-Z]/g, "")
    .substring(0, 3)
    .toUpperCase()
    .padEnd(3, "X");

  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
};

const generateUniqueReferralCode = async (name) => {
  let referralCode;
  let exists = true;

  while (exists) {
    referralCode = createReferralCode(name);
    exists = await User.exists({ referralCode });
  }

  return referralCode;
};

const getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (req.user._id.toString() === userId) {
      return res.status(400).json({ message: "You cannot ban your own account" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot be banned" });
    }

    user.isBanned = true;
    await user.save();

    res.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    next(error);
  }
};

const unbanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBanned = false;
    await user.save();

    res.status(200).json({ message: "User unbanned successfully" });
  } catch (error) {
    next(error);
  }
};
const generateMyReferralCode = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.referralCode) {
      return res.status(200).json({
        message: "Referral code already exists",
        referralCode: user.referralCode,
        user,
      });
    }

    user.referralCode = await generateUniqueReferralCode(user.name);
    await user.save();

    res.status(201).json({
      message: "Referral code generated successfully",
      referralCode: user.referralCode,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const applyReferralCode = async (req, res, next) => {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();

    if (!code) {
      return res.status(400).json({ message: "Referral code is required" });
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.usedReferral) {
      return res.status(400).json({ message: "Referral already used" });
    }

    const referrer = await User.findOne({ referralCode: code }).select("-password");

    if (!referrer) {
      return res.status(404).json({ message: "Invalid referral code" });
    }

    if (referrer._id.toString() === user._id.toString()) {
      return res.status(400).json({ message: "Cannot use your own code" });
    }

    // Give 5% discount to the user who applies the code.
    user.walletDiscount += 5;
    user.usedReferral = true;
    user.referredBy = code;

    // Give 10% discount to the referrer only once.
    if (!referrer.hasReferred) {
      referrer.walletDiscount += 10;
      referrer.hasReferred = true;
    }

    await user.save();
    await referrer.save();

    res.status(200).json({
      message: "Referral applied successfully. 5% discount added to your checkout wallet.",
      user,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getMyProfile,
  getAllUsers,
  banUser,
  unbanUser,
  generateMyReferralCode,
  applyReferralCode,
};
