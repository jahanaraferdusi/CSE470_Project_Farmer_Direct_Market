const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const {
  addToCompare,
  removeFromCompare,
  getCompareList,
  comparePrices,
} = require("../controllers/compareController");

const router = express.Router();

router.get("/", isLoggedIn, authorizeRoles("customer"), getCompareList);
router.post("/add", isLoggedIn, authorizeRoles("customer"), addToCompare);
router.post("/remove", isLoggedIn, authorizeRoles("customer"), removeFromCompare);
router.get("/prices", isLoggedIn, authorizeRoles("customer"), comparePrices);

module.exports = router;