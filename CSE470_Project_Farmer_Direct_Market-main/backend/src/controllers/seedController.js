const data = require("../data");
const User = require("../models/User");

const seedUsers = async (req, res, next) => {
  try {
    await User.deleteMany({});
    const users = await User.insertMany(data.users);

    res.status(201).json({
      message: "Seeded users successfully",
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { seedUsers };