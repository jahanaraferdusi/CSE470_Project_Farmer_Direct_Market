const Product = require("../models/Product");
const User = require("../models/User");

const addProduct = async (req, res, next) => {
  try {
    const seller = await User.findById(req.user._id);

    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products" });
    }

    if (!seller.sellerVerified) {
      return res.status(403).json({ message: "Seller is not verified yet" });
    }

    const { name, category, price, stock, description, lowStockThreshold } = req.body;

    const product = await Product.create({
      name,
      category,
      price,
      stock,
      description,
      lowStockThreshold,
      seller: req.user._id,
      lowStockAlert: stock <= (lowStockThreshold || 5),
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate("seller", "name email");
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id) {
      return res.status(403).json({ message: "You can update only your own product stock" });
    }

    product.stock = stock;
    product.lowStockAlert = stock <= product.lowStockThreshold;
    await product.save();

    res.status(200).json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  addProduct,
  getAllProducts,
  updateStock,
};