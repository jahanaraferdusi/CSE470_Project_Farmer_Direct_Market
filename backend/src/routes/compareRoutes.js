const express = require("express");
<<<<<<< HEAD
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
=======
const router = express.Router();
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40

const {
  addToCompare,
  removeFromCompare,
<<<<<<< HEAD
  getCompareList,
  clearCompareList,
} = require("../controllers/compareController");

const router = express.Router();

router.get("/", isLoggedIn, authorizeRoles("customer"), getCompareList);
router.post("/add", isLoggedIn, authorizeRoles("customer"), addToCompare);
router.post("/remove", isLoggedIn, authorizeRoles("customer"), removeFromCompare);
router.delete("/clear", isLoggedIn, authorizeRoles("customer"), clearCompareList);
=======
  comparePrices
} = require("../controllers/compareController");

router.post("/add", addToCompare);
router.post("/remove", removeFromCompare);
router.get("/:customerId", comparePrices);
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40

module.exports = router;