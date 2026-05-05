const mongoose = require("mongoose");

const giftCardSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    recipientName: {
      type: String,
      required: true,
      trim: true,
    },

    recipientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 5,
      max: 200,
    },

    balance: {
      type: Number,
      required: true,
      min: 0,
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "used", "disabled", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GiftCard", giftCardSchema);