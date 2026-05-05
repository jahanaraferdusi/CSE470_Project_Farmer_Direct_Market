const { Schema, model } = require("mongoose");

const harvestCalendarSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    cropCategory: {
      type: String,
      required: true,
      trim: true,
    },

    plantedDate: {
      type: Date,
      required: true,
    },

    expectedHarvestDate: {
      type: Date,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    unit: {
      type: String,
      default: "kg",
      trim: true,
    },

    location: {
      type: String,
      default: "",
      trim: true,
    },

    notes: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["Planted", "Growing", "Ready to Harvest", "Harvested", "Cancelled"],
      default: "Planted",
    },
  },
  { timestamps: true }
);

module.exports = model("HarvestCalendar", harvestCalendarSchema);