const Product = require("../models/Product");
const User = require("../models/User");

const getSpoilageMeta = (expiryDate) => {
  if (!expiryDate) {
    return {
      spoilageAlert: false,
      spoilageAlertDate: null,
      spoilageStatus: "fresh",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);

  const alertDate = new Date(expiry);
  alertDate.setDate(alertDate.getDate() - 30);
  alertDate.setHours(0, 0, 0, 0);

  if (today >= expiry) {
    return {
      spoilageAlert: true,
      spoilageAlertDate: alertDate,
      spoilageStatus: "spoiled",
    };
  }

  if (today >= alertDate) {
    return {
      spoilageAlert: true,
      spoilageAlertDate: alertDate,
      spoilageStatus: "warning",
    };
  }

  return {
    spoilageAlert: false,
    spoilageAlertDate: alertDate,
    spoilageStatus: "fresh",
  };
};

const addProduct = async (req, res, next) => {
  try {
    const seller = await User.findById(req.user._id);

    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add products" });
    }

    if (!seller.sellerVerified) {
      return res.status(403).json({ message: "Seller is not verified yet" });
    }

    const {
      name,
      category,
      price,
      stock,
      description,
      lowStockThreshold,
      expiryDate,
      originalPrice,
      discountPercentage,
      isDiscounted,
    } = req.body;
    const numericPrice = Number(price);
    const numericOriginalPrice = originalPrice ? Number(originalPrice) : null;

    const normalizedOriginalPrice =
      numericOriginalPrice && numericOriginalPrice > numericPrice
        ? numericOriginalPrice
        : null;

    const normalizedDiscountPercentage = normalizedOriginalPrice
      ? Number(
          discountPercentage ||
            (((normalizedOriginalPrice - numericPrice) / normalizedOriginalPrice) * 100).toFixed(2)
        )
      : 0;

    const hasDiscount = Boolean(isDiscounted) || Boolean(normalizedOriginalPrice);
    const safeThreshold = Number(lowStockThreshold) || 5;
    const numericStock = Number(stock);

    const spoilageMeta = getSpoilageMeta(expiryDate);

    const product = await Product.create({
      name,
      category,
      price: numericPrice,
      stock: numericStock,
      description,
      lowStockThreshold: safeThreshold,
      seller: req.user._id,
      lowStockAlert: numericStock <= safeThreshold,
      expiryDate: expiryDate || null,
      spoilageAlert: spoilageMeta.spoilageAlert,
      spoilageAlertDate: spoilageMeta.spoilageAlertDate,
      spoilageStatus: spoilageMeta.spoilageStatus,
      originalPrice: normalizedOriginalPrice,
      discountPercentage: hasDiscount ? normalizedDiscountPercentage : 0,
      isDiscounted: hasDiscount,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};
const getDiscountedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({
      isDiscounted: true,
      stock: { $gt: 0 },
    })
      .populate("seller", "name email")
      .sort({ discountPercentage: -1, createdAt: -1 });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
const getAllProducts = async (req, res, next) => {
  try {
    const { search, category, minPrice, maxPrice, sort, inStock } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = { $regex: `^${category}$`, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (inStock === "true") {
      query.stock = { $gt: 0 };
    }

    let productQuery = Product.find(query).populate("seller", "name email");

    switch (sort) {
      case "priceLow":
        productQuery = productQuery.sort({ price: 1 });
        break;
      case "priceHigh":
        productQuery = productQuery.sort({ price: -1 });
        break;
      case "name":
        productQuery = productQuery.sort({ name: 1 });
        break;
      case "stock":
        productQuery = productQuery.sort({ stock: -1 });
        break;
      default:
        productQuery = productQuery.sort({ createdAt: -1 });
        break;
    }

    const products = await productQuery;
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const updateStock = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { stock, expiryDate } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You can update only your own product stock" });
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (expiryDate !== undefined) {
      product.expiryDate = expiryDate || null;
    }

    product.lowStockAlert = product.stock <= product.lowStockThreshold;

    const spoilageMeta = getSpoilageMeta(product.expiryDate);
    product.spoilageAlert = spoilageMeta.spoilageAlert;
    product.spoilageAlertDate = spoilageMeta.spoilageAlertDate;
    product.spoilageStatus = spoilageMeta.spoilageStatus;

    await product.save();

    res.status(200).json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerProducts = async (req, res, next) => {
  try {
    const { sellerId } = req.params;

    if (req.user._id.toString() !== sellerId.toString()) {
      return res
        .status(403)
        .json({ message: "You can view only your own products" });
    }

    const products = await Product.find({ seller: sellerId }).sort({
      createdAt: -1,
    });

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getSellerSpoilageAlerts = async (req, res, next) => {
  try {
    const products = await Product.find({
      seller: req.user._id,
      spoilageAlert: true,
    }).sort({ expiryDate: 1 });

    res.status(200).json({
      hasSpoilageAlert: products.length > 0,
      products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getAllProducts,
  updateStock,
  getSellerProducts,
  getSellerSpoilageAlerts,
  getDiscountedProducts,
};
