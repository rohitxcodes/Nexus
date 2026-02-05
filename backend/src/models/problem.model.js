const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema(
  {
    input: String,
    expectedOutput: String,
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

const problemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    tags: [String],
    constraints: String,
    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],
    testCases: [testCaseSchema],
    levelNumber: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Problem", problemSchema);
