const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const OrderStatusTracker = require("../models/OrderStatusTracker");
const ReturnRequest = require("../models/ReturnRequest");
const allowedDeliverySlots = [
  "08:00 AM - 11:00 AM",
  "11:00 AM - 02:00 PM",
  "02:00 PM - 05:00 PM",
  "05:00 PM - 08:00 PM",
  "08:00 PM - 11:00 PM",
];

const checkout = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod, deliverySlot } = req.body;

    if (!deliverySlot || !allowedDeliverySlots.includes(deliverySlot)) {
      return res.status(400).json({
        message: "Please select a valid delivery slot.",
      });
    }

    const cart = await Cart.findOne({ customer: req.user._id }).populate(
      "items.product"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.product.name}`,
        });
      }

      product.stock -= item.quantity;
      product.lowStockAlert = product.stock <= product.lowStockThreshold;
      await product.save();

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
        seller: product.seller,
      });

      totalAmount += product.price * item.quantity;
    }
    const user = req.user;

    // Apply wallet discount
    if (user.walletDiscount > 0) {
      const discountAmount =
        (totalAmount * user.walletDiscount) / 100;

      totalAmount -= discountAmount;

      user.walletDiscount = 0;
      await user.save();
}
    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      deliverySlot,
      status: "Pending",
    });
    await OrderStatusTracker.create({
      orderId: order._id,
      currentStatus: "Pending",
      statusHistory: [{ status: "Pending" }]
    });
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Checkout successful",
      order,
    });
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("items.product", "name category")
      .sort({ createdAt: -1 });

    const orderIds = orders.map((order) => order._id);
    const returnRequests = await ReturnRequest.find({ order: { $in: orderIds } }).select(
      "order status"
    );

    const requestsByOrder = returnRequests.reduce((acc, request) => {
      const orderId = request.order.toString();
      if (!acc[orderId]) {
        acc[orderId] = [];
      }
      acc[orderId].push(request.status);
      return acc;
    }, {});

    const ordersWithReturnInfo = orders.map((order) => {
      const orderObject = order.toObject();
      const statuses = requestsByOrder[order._id.toString()] || [];

      let returnSummary = null;

      if (statuses.length > 0) {
        if (statuses.every((status) => status === "Approved")) {
          returnSummary = { status: "Approved" };
        } else if (statuses.every((status) => status === "Denied")) {
          returnSummary = { status: "Denied" };
        } else if (statuses.some((status) => status === "Pending")) {
          returnSummary = { status: "Pending" };
        } else {
          returnSummary = { status: "Partially Approved" };
        }
      }

      orderObject.returnSummary = returnSummary;
      return orderObject;
    });

    res.status(200).json(ordersWithReturnInfo);
  } catch (error) {
    next(error);
  }
};

const getSellerDeliverySlots = async (req, res, next) => {
  try {
    const orders = await Order.find({ "items.seller": req.user._id })
      .populate("items.product", "name category")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    const deliveryList = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (item.seller.toString() === req.user._id.toString()) {
          deliveryList.push({
            orderId: order._id,
            productName: item.product?.name || "Unknown Product",
            category: item.product?.category || "N/A",
            quantity: item.quantity,
            deliverySlot: order.deliverySlot,
            customerName: order.customer?.name || "Customer",
            shippingAddress: order.shippingAddress,
            status: order.status,
            orderedAt: order.createdAt,
          });
        }
      });
    });

    res.status(200).json(deliveryList);
  } catch (error) {
    next(error);
  }
};

const getAdminDeliverySlots = async (req, res, next) => {
  try {
    const orders = await Order.find({})
      .populate("items.product", "name category")
      .populate("items.seller", "name email")
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    const deliveryList = [];

    orders.forEach((order) => {
      order.items.forEach((item) => {
        deliveryList.push({
          orderId: order._id,
          productName: item.product?.name || "Unknown Product",
          category: item.product?.category || "N/A",
          quantity: item.quantity,
          deliverySlot: order.deliverySlot,
          sellerName: item.seller?.name || "Seller",
          customerName: order.customer?.name || "Customer",
          shippingAddress: order.shippingAddress,
          status: order.status,
          orderedAt: order.createdAt,
        });
      });
    });

    res.status(200).json(deliveryList);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkout,
  getMyOrders,
  getSellerDeliverySlots,
  getAdminDeliverySlots,
};