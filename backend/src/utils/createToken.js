const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../secret");

const createToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      sellerVerified: user.sellerVerified,
    },
    jwtSecret,
    { expiresIn: "7d" }
  );
};

module.exports = createToken;
