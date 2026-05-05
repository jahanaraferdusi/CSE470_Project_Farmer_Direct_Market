const { Schema, model } = require("mongoose");

const pollVoteSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    votes: {
      type: Number,
      default: 0,
      min: 0,
      max: 2,
    },
  },
  { _id: false }
);

const pollSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    votes: [pollVoteSchema],
    totalVotes: {
      type: Number,
      default: 0,
    },
    endsAt: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Poll = model("Poll", pollSchema);

module.exports = Poll;