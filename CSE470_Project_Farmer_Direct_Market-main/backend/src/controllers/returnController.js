const Order = require("../models/Order");
const ReturnRequest = require("../models/ReturnRequest");

const requestReturn = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      customer: req.user._id,
    })
      .populate("items.product", "name category")
      .populate("items.seller", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "Delivered") {
      return res.status(400).json({
        message: "Return request can only be created for delivered orders.",
      });
    }

    const existingRequests = await ReturnRequest.find({ order: order._id }).select("seller");
    const existingSellerIds = new Set(
      existingRequests.map((request) => request.seller.toString())
    );

    const groupedBySeller = new Map();

    order.items.forEach((item) => {
      const sellerId = item.seller._id ? item.seller._id.toString() : item.seller.toString();

      if (!groupedBySeller.has(sellerId)) {
        groupedBySeller.set(sellerId, {
          seller: item.seller._id || item.seller,
          items: [],
          requestAmount: 0,
        });
      }

      const currentGroup = groupedBySeller.get(sellerId);
      currentGroup.items.push({
        product: item.product?._id || item.product,
        productName: item.product?.name || "Product removed",
        quantity: item.quantity,
        price: item.price,
      });
      currentGroup.requestAmount += Number(item.price || 0) * Number(item.quantity || 0);
    });

    const requestsToCreate = [];

    for (const [sellerId, group] of groupedBySeller.entries()) {
      if (existingSellerIds.has(sellerId)) {
        continue;
      }

      requestsToCreate.push({
        order: order._id,
        customer: req.user._id,
        seller: group.seller,
        items: group.items,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        orderTotalAmount: order.totalAmount,
        requestAmount: group.requestAmount,
        orderedAt: order.createdAt,
        message: "Customer wants refund",
        status: "Pending",
      });
    }

    if (requestsToCreate.length === 0) {
      return res.status(200).json({
        message: "Return request already submitted for this delivered order.",
      });
    }

    await ReturnRequest.insertMany(requestsToCreate);

    return res.status(201).json({
      message: "Return request sent to seller successfully.",
    });
  } catch (error) {
    next(error);
  }
};

const getSellerReturnRequests = async (req, res, next) => {
  try {
    const requests = await ReturnRequest.find({ seller: req.user._id })
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

const decideReturnRequest = async (req, res, next) => {
  try {
    const { decision } = req.body;

    if (!["Approved", "Denied"].includes(decision)) {
      return res.status(400).json({ message: "Decision must be Approved or Denied." });
    }

    const request = await ReturnRequest.findById(req.params.returnRequestId);

    if (!request) {
      return res.status(404).json({ message: "Return request not found." });
    }

    if (request.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        message: `This return request is already ${request.status.toLowerCase()}.`,
      });
    }

    request.status = decision;
    request.decidedAt = new Date();
    await request.save();

    res.status(200).json({
      message: `Return request ${decision.toLowerCase()} successfully.`,
      request,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  requestReturn,
  getSellerReturnRequests,
  decideReturnRequest,
};
