const express = require("express");
const router = express.Router();

const {
  addToCompare,
  removeFromCompare,
  comparePrices
} = require("../controllers/compareController");

router.post("/add", addToCompare);
router.post("/remove", removeFromCompare);
router.get("/:customerId", comparePrices);

module.exports = router;