const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const { checkout } = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", isLoggedIn, authorizeRoles("customer"), checkout);

module.exports = router;