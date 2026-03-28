const express = require("express");
const router = express.Router();

const Wishlist = require("../models/Wishlist");
const Product = require("../models/Product");

// Add to wishlist
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    if (!userId || !productId) {
      return res.status(400).json({ msg: "userId and productId are required" });
    }

    const exists = await Wishlist.findOne({
      user: userId,
      product: productId,
    });

    if (exists) {
      return res.status(400).json({ msg: "Already wished" });
    }

    const item = new Wishlist({
      user: userId,
      product: productId,
    });

    await item.save();

    await Product.findByIdAndUpdate(productId, {
      $inc: { wishlistCount: 1 },
    });

    res.json({ msg: "Added to wishlist" });
  } catch (err) {
    console.error("Add wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Remove from wishlist
router.post("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    if (!userId || !productId) {
      return res.status(400).json({ msg: "userId and productId are required" });
    }

    const deleted = await Wishlist.findOneAndDelete({
      user: userId,
      product: productId,
    });

    if (deleted) {
      await Product.findByIdAndUpdate(productId, {
        $inc: { wishlistCount: -1 },
      });
    }

    res.json({ msg: "Removed from wishlist" });
  } catch (err) {
    console.error("Remove wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Seller wishlist stats page
// IMPORTANT: replace "seller" below if your Product model uses another field name
router.get("/seller/:sellerId", async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.sellerId }).select(
      "name wishlistCount price stock"
    );

    res.json(products);
  } catch (err) {
    console.error("Seller wishlist stats error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Customer's own wishlist
router.get("/:userId", async (req, res) => {
  try {
    const items = await Wishlist.find({ user: req.params.userId }).populate(
      "product"
    );

    res.json(items);
  } catch (err) {
    console.error("Get wishlist error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;