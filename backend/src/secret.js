const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
});

const serverPort = process.env.SERVER_PORT || 5000;
const mongodburl = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET || "farmersupersecret";
const defaultimagePath =
  process.env.DEFAULT_IMAGE_PATH || "/images/default.jpg";

module.exports = {
  serverPort,
  mongodburl,
  jwtSecret,
  defaultimagePath,
<<<<<<< HEAD
};
=======
};
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
