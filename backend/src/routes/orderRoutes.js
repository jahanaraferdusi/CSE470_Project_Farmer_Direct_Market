const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
<<<<<<< HEAD
const { checkout, getMyOrders } = require("../controllers/orderController");

const router = express.Router();

router.get("/my-orders", isLoggedIn, authorizeRoles("customer"), getMyOrders);
router.post("/checkout", isLoggedIn, authorizeRoles("customer"), checkout);

module.exports = router;
=======
const { checkout } = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", isLoggedIn, authorizeRoles("customer"), checkout);

module.exports = router;
>>>>>>> fb62d7f298be7aa7d970834080bbe89182acfd69
