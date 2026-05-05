const mongoose = require("mongoose");

const harvestCalendarSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    expectedHarvestDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "kg" },
    expectedPrice: { type: Number, required: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Upcoming", "Harvesting Soon", "Available", "Cancelled"],
      default: "Upcoming",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("HarvestCalendar", harvestCalendarSchema);