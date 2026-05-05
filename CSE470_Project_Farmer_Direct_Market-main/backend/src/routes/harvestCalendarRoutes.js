const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  addHarvestEntry,
  getAllHarvestEntries,
  getMyHarvestEntries,
  updateHarvestEntry,
  deleteHarvestEntry,
} = require("../controllers/harvestCalendarController");

const router = express.Router();

router.get("/", getAllHarvestEntries);

router.get(
  "/seller/my",
  isLoggedIn,
  authorizeRoles("seller"),
  getMyHarvestEntries
);

router.post(
  "/",
  isLoggedIn,
  authorizeRoles("seller"),
  addHarvestEntry
);

router.put(
  "/:entryId",
  isLoggedIn,
  authorizeRoles("seller"),
  updateHarvestEntry
);

router.delete(
  "/:entryId",
  isLoggedIn,
  authorizeRoles("seller"),
  deleteHarvestEntry
);

module.exports = router;