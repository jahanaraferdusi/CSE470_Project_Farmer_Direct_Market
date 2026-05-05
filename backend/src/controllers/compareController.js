const CompareList = require("../models/CompareList");
const Product = require("../models/Product");
const addToCompare = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let list = await CompareList.findOne({ customerId });

    if (!list) {
      list = new CompareList({
        customerId,
        selectedProducts: [],
      });
    }

    const alreadyAdded = list.selectedProducts.some(
      (id) => id.toString() === productId
    );

    if (alreadyAdded) {
      return res.status(400).json({
        message: "Product already added to compare",
      });
    }

    if (list.selectedProducts.length >= 3) {
      return res.status(400).json({
        message: "You can compare only 3 products at once",
      });
    }

    list.selectedProducts.push(productId);
    await list.save();

    const updatedList = await CompareList.findOne({ customerId }).populate(
      "selectedProducts"
    );

    res.status(200).json({
      message: "Product added to compare",
      products: updatedList.selectedProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const removeFromCompare = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.body;

    const list = await CompareList.findOne({ customerId });

    if (!list) {
      return res.status(404).json({ message: "Compare list not found" });
    }

    list.selectedProducts = list.selectedProducts.filter(
      (id) => id.toString() !== productId
    );

    await list.save();

    const updatedList = await CompareList.findOne({ customerId }).populate(
      "selectedProducts"
    );

    res.status(200).json({
      message: "Product removed from compare",
      products: updatedList.selectedProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCompareList = async (req, res) => {
  try {
    const customerId = req.user._id;

    const list = await CompareList.findOne({ customerId }).populate({
      path: "selectedProducts",
      populate: {
        path: "seller",
        select: "name email",
      },
    });

    if (!list) {
      return res.status(200).json([]);
    }

    res.status(200).json(list.selectedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const clearCompareList = async (req, res) => {
  try {
    const customerId = req.user._id;

    await CompareList.findOneAndUpdate(
      { customerId },
      { selectedProducts: [] },
      { new: true, upsert: true }
    );

    res.status(200).json({
      message: "Compare list cleared",
      products: [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToCompare,
  removeFromCompare,
  getCompareList,
  clearCompareList,
};