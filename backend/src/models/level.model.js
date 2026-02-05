const mongoose = require("mongoose");

const levelSchema = new mongoose.Schema(
  {
    levelNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    problemIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],
    xpReward: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Level", levelSchema);
