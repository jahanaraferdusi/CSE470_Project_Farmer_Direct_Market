const HarvestCalendar = require("../models/HarvestCalendar");

exports.getAllHarvestItems = async (req, res) => {
  try {
    const items = await HarvestCalendar.find()
      .populate("seller", "name email")
      .sort({ expectedHarvestDate: 1 });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch harvest calendar", error: error.message });
  }
};

exports.getSellerHarvestItems = async (req, res) => {
  try {
    const items = await HarvestCalendar.find({ seller: req.user._id }).sort({
      expectedHarvestDate: 1,
    });

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch seller harvest items", error: error.message });
  }
};

exports.createHarvestItem = async (req, res) => {
  try {
    const item = await HarvestCalendar.create({
      ...req.body,
      seller: req.user._id,
    });

    res.status(201).json({ message: "Harvest item added successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Failed to add harvest item", error: error.message });
  }
};

exports.updateHarvestItem = async (req, res) => {
  try {
    const item = await HarvestCalendar.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Harvest item not found" });
    }

    Object.assign(item, req.body);
    const updatedItem = await item.save();

    res.status(200).json({ message: "Harvest item updated successfully", item: updatedItem });
  } catch (error) {
    res.status(500).json({ message: "Failed to update harvest item", error: error.message });
  }
};

exports.deleteHarvestItem = async (req, res) => {
  try {
    const item = await HarvestCalendar.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!item) {
      return res.status(404).json({ message: "Harvest item not found" });
    }

    await item.deleteOne();

    res.status(200).json({ message: "Harvest item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete harvest item", error: error.message });
  }
};