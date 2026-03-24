const express = require("express");
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { getMyProfile } = require("../controllers/userController");

const router = express.Router();

router.get("/me", isLoggedIn, getMyProfile);

module.exports = router;