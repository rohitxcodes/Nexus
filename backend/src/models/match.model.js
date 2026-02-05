const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    player1Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    player2Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ONGOING", "COMPLETED"],
      default: "PENDING",
    },
    winnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Match", matchSchema);
