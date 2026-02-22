const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    totalXP: {
      type: Number,
      default: 0,
      min: 0, // prevent negative XP
    },
    currentLevel: {
      type: Number,
      default: 1,
      min: 1,
    },
    completedLevels: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true },
);

userSchema.index({ totalXP: -1, createdAt: 1 });

module.exports = mongoose.model("User", userSchema);
