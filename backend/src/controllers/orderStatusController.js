const OrderStatusTracker = require("../models/OrderStatusTracker");

// ✅ Allowed statuses
const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

// ✅ Update Status
const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "orderId and status are required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const tracker = await OrderStatusTracker.findOne({ orderId });

    if (!tracker) {
      return res.status(404).json({
        message: "Order tracker not found",
      });
    }

    tracker.currentStatus = status;

    tracker.statusHistory.push({
      status,
      date: new Date(),
    });

    tracker.updatedAt = new Date();

    await tracker.save();

    res.json({
      success: true,
      tracker,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Status
const getStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const tracker = await OrderStatusTracker.findOne({ orderId });

    if (!tracker) {
      return res.status(404).json({
        message: "Order status not found",
      });
    }

    res.json({
      currentStatus: tracker.currentStatus,
      statusHistory: tracker.statusHistory || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateStatus, getStatus };