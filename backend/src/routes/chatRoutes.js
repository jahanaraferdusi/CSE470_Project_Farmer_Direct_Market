const express = require("express");
const {
  sendMessage,
  replyMessage,
  getMyChats,
  getSingleChat,
} = require("../controllers/chatController");

const { isLoggedIn } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/send", isLoggedIn, sendMessage);
router.post("/:chatId/reply", isLoggedIn, replyMessage);
router.get("/my-chats", isLoggedIn, getMyChats);
router.get("/:chatId", isLoggedIn, getSingleChat);

module.exports = router;