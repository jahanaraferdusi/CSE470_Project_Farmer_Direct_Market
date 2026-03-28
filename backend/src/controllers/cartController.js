const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    let cart = await Cart.findOne({ customer: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        customer: req.user._id,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;

      if (existingItem.quantity > product.stock) {
        return res.status(400).json({ message: "Insufficient stock" });
      }
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id }).populate("items.product");
    res.status(200).json(cart || { customer: req.user._id, items: [] });
  } catch (error) {
    next(error);
  }
};

const updateCartQuantity = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (quantity > product.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cartItem.quantity = quantity;
    await cart.save();

    const updatedCart = await Cart.findOne({ customer: req.user._id }).populate("items.product");

    res.status(200).json({
      message: "Cart quantity updated",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ customer: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ customer: req.user._id }).populate("items.product");

    res.status(200).json({
      message: "Item removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
  getMyCart,
  updateCartQuantity,
  removeFromCart,
};
