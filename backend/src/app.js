<<<<<<< HEAD
require("dotenv").config(); 
=======
require("dotenv").config(); // ✅ ADD THIS LINE

>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes.js");
const seedRoutes = require("./routes/seedRoutes");
const compareRoutes = require("./routes/compareRoutes");
const harvestCalendarRoutes = require("./routes/harvestCalendarRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const chatRoutes = require("./routes/chatRoutes");
const giftCardRoutes = require("./routes/giftCardRoutes");
const pollRoutes = require("./routes/pollRoutes");
const orderStatusRoutes = require("./routes/orderStatusRoutes");
<<<<<<< HEAD
const walletRoutes = require("./routes/walletRoutes");
=======
>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Farmer Direct Market Platform API");
});

app.get("/test", (req, res) => {
  res.status(200).json({ message: "API endpoint is working" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/harvest-calendar", harvestCalendarRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/gift-cards", giftCardRoutes);
app.use("/api/polls", pollRoutes);
app.use("/api/seed", seedRoutes);
app.use("/api/order-status", orderStatusRoutes);
app.use("/api/compare", compareRoutes);
<<<<<<< HEAD
app.use("/api/wallet", walletRoutes);
=======

>>>>>>> 6f247cf3ea6bcebfaa3d1a57d037b81cf1d14c40
app.use(notFound);
app.use(errorHandler);

module.exports = app;