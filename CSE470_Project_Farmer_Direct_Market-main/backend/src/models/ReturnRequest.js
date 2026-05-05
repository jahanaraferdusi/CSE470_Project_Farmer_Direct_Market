const { Schema, model } = require("mongoose");

const returnItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const returnRequestSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [returnItemSchema],
    message: {
      type: String,
      default: "Customer wants refund",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      default: "Cash on Delivery",
    },
    orderTotalAmount: {
      type: Number,
      required: true,
    },
    requestAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Denied"],
      default: "Pending",
    },
    orderedAt: {
      type: Date,
      required: true,
    },
    decidedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

returnRequestSchema.index({ order: 1, seller: 1 }, { unique: true });

module.exports = model("ReturnRequest", returnRequestSchema);
