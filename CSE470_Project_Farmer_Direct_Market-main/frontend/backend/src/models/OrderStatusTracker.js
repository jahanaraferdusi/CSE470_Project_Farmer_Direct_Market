const mongoose = require("mongoose");

const orderStatusTrackerSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  currentStatus: {
    type: String,
    enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
  statusHistory: [
    {
      status: String,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("OrderStatusTracker", orderStatusTrackerSchema);