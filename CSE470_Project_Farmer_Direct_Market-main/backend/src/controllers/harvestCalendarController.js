const HarvestCalendar = require("../models/HarvestCalendar");
const User = require("../models/User");

const addHarvestEntry = async (req, res, next) => {
  try {
    const seller = await User.findById(req.user._id);

    if (!seller || seller.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add harvest calendar entries" });
    }

    if (!seller.sellerVerified) {
      return res.status(403).json({ message: "Seller is not verified yet" });
    }

    const {
      cropName,
      cropCategory,
      plantedDate,
      expectedHarvestDate,
      quantity,
      unit,
      location,
      notes,
      status,
    } = req.body;

    if (!cropName || !cropCategory || !plantedDate || !expectedHarvestDate || quantity === undefined) {
      return res.status(400).json({
        message: "cropName, cropCategory, plantedDate, expectedHarvestDate, and quantity are required",
      });
    }

    const planted = new Date(plantedDate);
    const harvest = new Date(expectedHarvestDate);

    if (harvest < planted) {
      return res.status(400).json({
        message: "Expected harvest date cannot be before planted date",
      });
    }

    const entry = await HarvestCalendar.create({
      seller: req.user._id,
      cropName,
      cropCategory,
      plantedDate,
      expectedHarvestDate,
      quantity: Number(quantity),
      unit: unit || "kg",
      location,
      notes,
      status: status || "Planted",
    });

    res.status(201).json({
      message: "Harvest calendar entry added successfully",
      entry,
    });
  } catch (error) {
    next(error);
  }
};

const getAllHarvestEntries = async (req, res, next) => {
  try {
    const { search, status, month, sellerId, category } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { cropName: { $regex: search, $options: "i" } },
        { cropCategory: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    }

    if (sellerId) {
      query.seller = sellerId;
    }

    if (category) {
      query.cropCategory = { $regex: `^${category}$`, $options: "i" };
    }

    if (month) {
      const year = new Date().getFullYear();
      const monthNumber = Number(month);

      if (monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ message: "Month must be between 1 and 12" });
      }

      const startDate = new Date(year, monthNumber - 1, 1);
      const endDate = new Date(year, monthNumber, 1);

      query.expectedHarvestDate = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const entries = await HarvestCalendar.find(query)
      .populate("seller", "name email")
      .sort({ expectedHarvestDate: 1 });

    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

const getMyHarvestEntries = async (req, res, next) => {
  try {
    const entries = await HarvestCalendar.find({ seller: req.user._id })
      .populate("seller", "name email")
      .sort({ expectedHarvestDate: 1 });

    res.status(200).json(entries);
  } catch (error) {
    next(error);
  }
};

const updateHarvestEntry = async (req, res, next) => {
  try {
    const { entryId } = req.params;

    const entry = await HarvestCalendar.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: "Harvest calendar entry not found" });
    }

    if (entry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can update only your own harvest calendar entries" });
    }

    const {
      cropName,
      cropCategory,
      plantedDate,
      expectedHarvestDate,
      quantity,
      unit,
      location,
      notes,
      status,
    } = req.body;

    if (cropName !== undefined) entry.cropName = cropName;
    if (cropCategory !== undefined) entry.cropCategory = cropCategory;
    if (plantedDate !== undefined) entry.plantedDate = plantedDate;
    if (expectedHarvestDate !== undefined) entry.expectedHarvestDate = expectedHarvestDate;
    if (quantity !== undefined) entry.quantity = Number(quantity);
    if (unit !== undefined) entry.unit = unit;
    if (location !== undefined) entry.location = location;
    if (notes !== undefined) entry.notes = notes;
    if (status !== undefined) entry.status = status;

    if (new Date(entry.expectedHarvestDate) < new Date(entry.plantedDate)) {
      return res.status(400).json({
        message: "Expected harvest date cannot be before planted date",
      });
    }

    await entry.save();

    res.status(200).json({
      message: "Harvest calendar entry updated successfully",
      entry,
    });
  } catch (error) {
    next(error);
  }
};

const deleteHarvestEntry = async (req, res, next) => {
  try {
    const { entryId } = req.params;

    const entry = await HarvestCalendar.findById(entryId);

    if (!entry) {
      return res.status(404).json({ message: "Harvest calendar entry not found" });
    }

    if (entry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can delete only your own harvest calendar entries" });
    }

    await HarvestCalendar.findByIdAndDelete(entryId);

    res.status(200).json({
      message: "Harvest calendar entry deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addHarvestEntry,
  getAllHarvestEntries,
  getMyHarvestEntries,
  updateHarvestEntry,
  deleteHarvestEntry,
};