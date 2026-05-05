const OrderStatusTracker = require("../models/OrderStatusTracker");
const Order = require("../models/Order");

// ✅ Update Status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({
        message: "orderId and status required"
      });
    }

    let tracker = await OrderStatusTracker.findOne({ orderId });

    if (!tracker) {
      tracker = new OrderStatusTracker({
        orderId,
        statusHistory: []
      });
    }

    tracker.currentStatus = status;

    tracker.statusHistory.push({
      status,
      date: new Date()
    });

    tracker.updatedAt = new Date();

    await tracker.save();

    if (["Pending", "Confirmed", "Delivered", "Cancelled"].includes(status)) {
      await Order.findByIdAndUpdate(orderId, { status });
    }

    res.json({
      success: true,
      tracker
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Status
const getStatus = async (req, res) => {
  try {
    const tracker = await OrderStatusTracker.findOne({
      orderId: req.params.orderId
    });

    // ⭐ IMPORTANT FIX
    if (!tracker) {
      return res.status(404).json({
        message: "Order status not found"
      });
    }

    res.json({
      currentStatus: tracker.currentStatus,
      statusHistory: tracker.statusHistory || []
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateStatus, getStatus };