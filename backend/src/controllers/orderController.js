const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const checkout = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    const cart = await Cart.findOne({ customer: req.user._id }).populate("items.product");

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

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "Pending",
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

module.exports = {
  checkout,
};
