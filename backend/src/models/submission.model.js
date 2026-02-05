const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    levelNumber: {
      type: Number,
      required: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["cpp", "java", "python", "javascript"],
    },

    code: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "WRONG_ANSWER", "ERROR"],
      default: "PENDING",
    },

    runtime: {
      type: String,
      default: null,
    },

    memory: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Submission", submissionSchema);
