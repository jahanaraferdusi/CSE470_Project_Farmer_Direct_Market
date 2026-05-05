const CompareList = require("../models/CompareList");
<<<<<<< HEAD
const Product = require("../models/Product");
const addToCompare = async (req, res) => {
  try {
    const customerId = req.user._id;
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
=======

// Add to compare
const addToCompare = async (req, res) => {
  try {
    const { customerId, productId } = req.body;
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40

    let list = await CompareList.findOne({ customerId });

    if (!list) {
<<<<<<< HEAD
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

=======
      list = new CompareList({ customerId, selectedProducts: [] });
    }

    if (!list.selectedProducts.includes(productId)) {
      list.selectedProducts.push(productId);
    }

    await list.save();

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove
const removeFromCompare = async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    const list = await CompareList.findOne({ customerId });

>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
    list.selectedProducts = list.selectedProducts.filter(
      (id) => id.toString() !== productId
    );

    await list.save();

<<<<<<< HEAD
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
=======
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Compare prices
const comparePrices = async (req, res) => {
  try {
    const { customerId } = req.params;

    const list = await CompareList.findOne({ customerId })
      .populate("selectedProducts");

    if (!list) return res.json([]);

    const comparison = list.selectedProducts.map(p => ({
      name: p.name,
      price: p.price,
      discount: p.discount || 0,
      finalPrice: p.price - (p.discount || 0)
    }));

    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
  }
};

module.exports = {
  addToCompare,
  removeFromCompare,
<<<<<<< HEAD
  getCompareList,
  clearCompareList,
=======
  comparePrices
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
};