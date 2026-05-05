const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      set: (v) => bcrypt.hashSync(v, 10),
    },
    role: {
      type: String,
      enum: ["admin", "seller", "customer"],
      default: "customer",
    },
    sellerVerified: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    referralCode: { type: String, unique: true },
    hasReferred: { type: Boolean, default: false }, // can refer only once
    referredBy: { type: String, default: null }, // store code used
    walletDiscount: { type: Number, default: 0 }, // saved discount %
    usedReferral: { type: Boolean, default: false } // one-time usage
  },
  { timestamps: true }
);

const User = model("User", userSchema);

module.exports = User;
