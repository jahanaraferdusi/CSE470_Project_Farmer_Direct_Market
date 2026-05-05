const CompareList = require("../models/CompareList");
const Product = require("../models/Product");

// Add to compare
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
        message: "Product already added",
      });
    }

    if (list.selectedProducts.length >= 3) {
      return res.status(400).json({
        message: "Max 3 products allowed",
      });
    }

    list.selectedProducts.push(productId);
    await list.save();

    const updated = await CompareList.findOne({ customerId }).populate("selectedProducts");

    res.json(updated.selectedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove
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

    const updated = await CompareList.findOne({ customerId }).populate("selectedProducts");

    res.json(updated.selectedProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get list
const getCompareList = async (req, res) => {
  try {
    const customerId = req.user._id;

    const list = await CompareList.findOne({ customerId }).populate("selectedProducts");

    res.json(list ? list.selectedProducts : []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Price comparison (extra feature)
const comparePrices = async (req, res) => {
  try {
    const customerId = req.user._id;

    const list = await CompareList.findOne({ customerId }).populate("selectedProducts");

    if (!list) return res.json([]);

    const result = list.selectedProducts.map((p) => ({
      name: p.name,
      price: p.price,
      discount: p.discount || 0,
      finalPrice: p.price - (p.discount || 0),
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addToCompare,
  removeFromCompare,
  getCompareList,
  comparePrices,
};