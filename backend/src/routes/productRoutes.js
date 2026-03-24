const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");

const { addProduct, getAllProducts, updateStock } = require("../controllers/productController");

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", isLoggedIn, authorizeRoles("seller"), addProduct);
router.put("/:productId/stock", isLoggedIn, authorizeRoles("seller"), updateStock);

module.exports = router;