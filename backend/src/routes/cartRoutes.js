const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { addToCart, getMyCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", isLoggedIn, authorizeRoles("customer"), getMyCart);
router.post("/", isLoggedIn, authorizeRoles("customer"), addToCart);

module.exports = router;