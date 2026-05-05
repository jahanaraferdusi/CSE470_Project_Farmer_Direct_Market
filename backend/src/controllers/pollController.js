const Poll = require("../models/Poll");
const Product = require("../models/Product");

const createPoll = async (req, res, next) => {
  try {
    const { productId, question } = req.body;

    if (!productId || !question) {
      return res.status(400).json({
        message: "Product and question are required.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can create poll only for your own product.",
      });
    }

    const endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const poll = await Poll.create({
      product: productId,
      seller: req.user._id,
      question,
      endsAt,
      isActive: true,
      votes: [],
      totalVotes: 0,
    });

    res.status(201).json({
      message: "Poll created successfully.",
      poll,
    });
  } catch (error) {
    next(error);
  }
};

const getSellerPolls = async (req, res, next) => {
  try {
    const polls = await Poll.find({ seller: req.user._id })
      .populate("product", "name category price stock")
      .sort({ createdAt: -1 });

    res.status(200).json(polls);
  } catch (error) {
    next(error);
  }
};

const getActivePolls = async (req, res, next) => {
  try {
    await Poll.updateMany(
      {
        isActive: true,
        endsAt: { $lte: new Date() },
      },
      {
        $set: { isActive: false },
      }
    );

    const polls = await Poll.find({
      isActive: true,
      endsAt: { $gt: new Date() },
    })
      .populate("product", "name category price stock")
      .populate("seller", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(polls);
  } catch (error) {
    next(error);
  }
};

const votePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    if (!poll.isActive || poll.endsAt <= new Date()) {
      poll.isActive = false;
      await poll.save();

      return res.status(400).json({
        message: "This poll has ended.",
      });
    }

    const existingVote = poll.votes.find(
      (vote) => vote.customer.toString() === req.user._id.toString()
    );

    if (existingVote) {
      if (existingVote.votes >= 2) {
        return res.status(400).json({
          message: "You have already used your maximum 2 votes for this poll.",
        });
      }

      existingVote.votes += 1;
    } else {
      poll.votes.push({
        customer: req.user._id,
        votes: 1,
      });
    }

    poll.totalVotes += 1;

    await poll.save();

    res.status(200).json({
      message: "Vote submitted successfully.",
      poll,
    });
  } catch (error) {
    next(error);
  }
};

const updatePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;
    const { question } = req.body;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    if (poll.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can update only your own poll.",
      });
    }

    if (question) {
      poll.question = question;
    }

    poll.endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    poll.isActive = true;

    await poll.save();

    res.status(200).json({
      message: "Poll updated successfully.",
      poll,
    });
  } catch (error) {
    next(error);
  }
};

const resetPoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    if (poll.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can reset only your own poll.",
      });
    }

    poll.votes = [];
    poll.totalVotes = 0;
    poll.endsAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    poll.isActive = true;

    await poll.save();

    res.status(200).json({
      message: "Poll reset successfully.",
      poll,
    });
  } catch (error) {
    next(error);
  }
};

const deletePoll = async (req, res, next) => {
  try {
    const { pollId } = req.params;

    const poll = await Poll.findById(pollId);

    if (!poll) {
      return res.status(404).json({ message: "Poll not found." });
    }

    if (poll.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can delete only your own poll.",
      });
    }

    await poll.deleteOne();

    res.status(200).json({
      message: "Poll deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPoll,
  getSellerPolls,
  getActivePolls,
  votePoll,
  updatePoll,
  resetPoll,
  deletePoll,
};