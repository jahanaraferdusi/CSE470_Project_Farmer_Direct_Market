const CompareList = require("../models/CompareList");

// Add to compare
const addToCompare = async (req, res) => {
  try {
    const { customerId, productId } = req.body;

    let list = await CompareList.findOne({ customerId });

    if (!list) {
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

    list.selectedProducts = list.selectedProducts.filter(
      (id) => id.toString() !== productId
    );

    await list.save();

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
  }
};

module.exports = {
  addToCompare,
  removeFromCompare,
  comparePrices
};