const mongoose = require("mongoose");

const userTrophySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    trophyKey: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate trophy awards
userTrophySchema.index({ userId: 1, trophyKey: 1 }, { unique: true });

module.exports = mongoose.model("UserTrophy", userTrophySchema);
