const Submission = require("../models/submission.model");
const Problem = require("../models/problem.model");
const levelService = require("../services/level.service");
const User = require("../models/user.model");
const submissionService = require("../services/submission/submission.service");
// const mongoose = require("mongoose");

// console.log("Connected DB Name:", mongoose.connection.name);
// console.log("Problem collection:", Problem.collection.name);

// const test = async () => {
//   const count = await Problem.countDocuments();
//   console.log("Total problem docs:", count);
// };

async function createSubmission(req, res) {
  console.log("REQ.USER:", req.user);

  try {
    const userId = req.user.userId;
    const levelNumber = Number(req.body.levelNumber);
    const { language, code } = req.body;

    if (!levelNumber || !language || !code) {
      return res.status(400).json({ message: "Missing fields" });
    }
    // const problemCheck = await Problem.find({});
    // console.log("All problems in DB:", problemCheck);

    const result = await submissionService.persistSubmission({
      userId,
      levelNumber,
      language,
      code,
    });

    return res.status(201).json(result);
  } catch (err) {
    if (err.message === "LEVEL_NOT_FOUND") {
      return res.status(404).json({ message: "Level not found" });
    }
    if (err.message === "LEVEL_LOCKED") {
      return res.status(403).json({ message: "Level not unlocked" });
    }
    if (err.message === "PROBLEM_NOT_FOUND") {
      return res
        .status(404)
        .json({ message: "Problem here is the problem not found" });
    }

    return res.status(500).json({ message: "Submission failed" });
  }
}

async function getSubmissionResult(req, res) {
  try {
    const submissionId = req.params.submissionId;

    const userId = req.user.userId;
    const submission = await Submission.findOne({
      _id: submissionId,
      userId,
    }).select("levelNumber status runtime memory createdAt");

    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    return res.status(200).json(submission);
  } catch (err) {
    return res.status(500).json({ message: "Submission failed" });
  }
}

module.exports = {
  createSubmission,
  getSubmissionResult,
};
