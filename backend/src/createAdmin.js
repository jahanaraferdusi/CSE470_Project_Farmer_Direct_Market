const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const admin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: "admin123",
      role: "admin",
      sellerVerified: true,
      isBanned: false,
    });

    await admin.save();

    console.log("Admin created successfully");
    console.log("email: admin@gmail.com");
    console.log("password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();