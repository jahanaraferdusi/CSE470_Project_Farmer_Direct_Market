const mongoose = require("mongoose");
const { mongodburl } = require("../secret");

const connectDatabase = async () => {
  try {
    if (!mongodburl) {
      throw new Error("MONGODB_URI is missing in .env file");
    }

    await mongoose.connect(mongodburl);

    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
    });
  } catch (error) {
    console.error("❌ Could not connect to db:", error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;