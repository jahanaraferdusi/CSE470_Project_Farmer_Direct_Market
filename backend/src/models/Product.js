const { Schema, model } = require("mongoose");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    lowStockAlert: {
      type: Boolean,
      default: false,
    },

    expiryDate: {
      type: Date,
      default: null,
    },
    spoilageAlert: {
      type: Boolean,
      default: false,
    },
    spoilageAlertDate: {
      type: Date,
      default: null,
    },
    spoilageStatus: {
      type: String,
      enum: ["fresh", "warning", "spoiled"],
      default: "fresh",
    },

    wishlistCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
