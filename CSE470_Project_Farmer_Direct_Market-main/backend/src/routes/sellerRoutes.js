const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const  authorizeRoles  = require("../middlewares/roleMiddleware");
const {
  getPendingSellers,
  verifySeller,
} = require("../controllers/sellerController");

const router = express.Router();

router.get("/pending", isLoggedIn, authorizeRoles("admin"), getPendingSellers);
router.put("/verify/:sellerId", isLoggedIn, authorizeRoles("admin"), verifySeller);

module.exports = router;
