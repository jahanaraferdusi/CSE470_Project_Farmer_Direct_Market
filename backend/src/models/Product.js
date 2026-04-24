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
<<<<<<< HEAD
=======

>>>>>>> fb62d7f298be7aa7d970834080bbe89182acfd69
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
<<<<<<< HEAD
    originalPrice: {
      type: Number,
      min: 0,
      default: null,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
=======

>>>>>>> fb62d7f298be7aa7d970834080bbe89182acfd69
    wishlistCount: {
      type: Number,
      default: 0,
    },
<<<<<<< HEAD
    averageRating: {
      type: Number,
      default: 0,
    },
=======
        averageRating: {
      type: Number,
      default: 0,
    },

>>>>>>> fb62d7f298be7aa7d970834080bbe89182acfd69
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
