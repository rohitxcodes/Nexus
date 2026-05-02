const mongoose = require("mongoose");

const rateLimitWindowSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },
    count: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastTs: {
      type: Number,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

rateLimitWindowSchema.index({ key: 1 }, { unique: true });
rateLimitWindowSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("RateLimitWindow", rateLimitWindowSchema);
