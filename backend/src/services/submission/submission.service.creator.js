// backend/src/services/submission/submission.service.creator.js

const Submission = require("../../models/submission.model");

async function createSubmission(frontendInput) {
  const { userId, problemId, levelNumber, language, code } = frontendInput;

  if (!userId || !problemId || !levelNumber || !language || !code) {
    throw new Error("INVALID_SUBMISSION_INPUT");
  }

  const submissionPayload = {
    userId,
    problemId,
    levelNumber,
    language,
    code,
    status: "PENDING",
  };

  return Submission.create(submissionPayload);
}

module.exports = { createSubmission };
