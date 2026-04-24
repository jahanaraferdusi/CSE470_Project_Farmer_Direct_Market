const Chat = require("../models/Chat");
const Product = require("../models/Product");

const sendMessage = async (req, res, next) => {
  try {
    const { productId, text } = req.body;

    if (!productId || !text) {
      return res.status(400).json({ message: "Product and message are required" });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const customerId = req.user._id;
    const sellerId = product.seller;

    if (customerId.toString() === sellerId.toString()) {
      return res.status(400).json({ message: "Seller cannot chat with own product" });
    }

    let chat = await Chat.findOne({
      customer: customerId,
      seller: sellerId,
      product: productId,
    });

    if (!chat) {
      chat = await Chat.create({
        customer: customerId,
        seller: sellerId,
        product: productId,
        messages: [],
      });
    }

    chat.messages.push({
      sender: customerId,
      text,
    });

    await chat.save();

    const fullChat = await Chat.findById(chat._id)
      .populate("customer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price")
      .populate("messages.sender", "name role");

    res.status(201).json({
      message: "Message sent successfully",
      chat: fullChat,
    });
  } catch (error) {
    next(error);
  }
};

const replyMessage = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You can reply only to your own chats" });
    }

    chat.messages.push({
      sender: req.user._id,
      text,
    });

    await chat.save();

    const fullChat = await Chat.findById(chat._id)
      .populate("customer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price")
      .populate("messages.sender", "name role");

    res.status(200).json({
      message: "Reply sent successfully",
      chat: fullChat,
    });
  } catch (error) {
    next(error);
  }
};

const getMyChats = async (req, res, next) => {
  try {
    let filter = {};

    if (req.user.role === "customer") {
      filter.customer = req.user._id;
    } else if (req.user.role === "seller") {
      filter.seller = req.user._id;
    } else {
      return res.status(403).json({ message: "Only customer or seller can view chats" });
    }

    const chats = await Chat.find(filter)
      .populate("customer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price")
      .populate("messages.sender", "name role")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    next(error);
  }
};

const getSingleChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("customer", "name email")
      .populate("seller", "name email")
      .populate("product", "name price")
      .populate("messages.sender", "name role");

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    const userId = req.user._id.toString();

    if (
      chat.customer._id.toString() !== userId &&
      chat.seller._id.toString() !== userId
    ) {
      return res.status(403).json({ message: "You cannot view this chat" });
    }

    res.status(200).json(chat);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  replyMessage,
  getMyChats,
  getSingleChat,
};