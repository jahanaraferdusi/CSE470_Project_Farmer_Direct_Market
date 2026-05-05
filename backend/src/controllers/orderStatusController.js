const OrderStatusTracker = require("../models/OrderStatusTracker");
const Order = require("../models/Order");

const allowedStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const updateStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "orderId and status required" });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let tracker = await OrderStatusTracker.findOne({ orderId });

    if (!tracker) {
      tracker = new OrderStatusTracker({
        orderId,
        currentStatus: status,
        statusHistory: [],
      });
    }

    tracker.currentStatus = status;
    tracker.statusHistory.push({
      status,
      date: new Date(),
    });

    await tracker.save();

    res.json({
      success: true,
      order,
      tracker,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getStatus = async (req, res) => {
  try {
    const tracker = await OrderStatusTracker.findOne({
      orderId: req.params.orderId,
    });

    if (!tracker) {
      return res.status(404).json({ message: "Order status not found" });
    }

    res.json({
      currentStatus: tracker.currentStatus,
      statusHistory: tracker.statusHistory || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { updateStatus, getStatus };