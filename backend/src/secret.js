require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 5000;
const mongodburl = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET || "farmersupersecret";
const defaultimagePath = process.env.DEFAULT_IMAGE_PATH || "/images/default.jpg";

module.exports = {
  serverPort,
  mongodburl,
  jwtSecret,
  defaultimagePath,
};