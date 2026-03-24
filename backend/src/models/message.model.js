const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    clanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clan",
      required: true,
      index: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Message", messageSchema);
