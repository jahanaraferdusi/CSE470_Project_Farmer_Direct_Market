const express = require("express");
const router = express.Router();

const {
  getAllHarvestItems,
  getSellerHarvestItems,
  createHarvestItem,
  updateHarvestItem,
  deleteHarvestItem,
} = require("../controllers/harvestCalendarController");

const { isLoggedIn, authorizeRoles } = require("../middlewares/authMiddleware");

// Customer and admin can see all upcoming harvest products
router.get("/", getAllHarvestItems);

// Seller can manage own harvest products
router.get("/seller", isLoggedIn, authorizeRoles("seller"), getSellerHarvestItems);
router.post("/", isLoggedIn, authorizeRoles("seller"), createHarvestItem);
router.put("/:id", isLoggedIn, authorizeRoles("seller"), updateHarvestItem);
router.delete("/:id", isLoggedIn, authorizeRoles("seller"), deleteHarvestItem);

module.exports = router;