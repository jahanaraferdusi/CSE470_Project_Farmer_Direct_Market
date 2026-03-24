const express = require("express");
const { seedUsers } = require("../controllers/seedController");

const router = express.Router();

router.get("/users", seedUsers);

module.exports = router;