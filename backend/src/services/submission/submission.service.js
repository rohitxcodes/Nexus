// backend/src/services/submission/submission.service.js

const Level = require("../../models/level.model");
const Problem = require("../../models/problem.model");

const { createSubmission } = require("./submission.service.creator");
const { buildWrappedCode } = require("./submission.service.wrapper");
const { executeCode } = require("./submission.service.client");
const { evaluateSubmission } = require("./submission.service.evaluator");
const { grantXPIfEligible } = require("./submission.service.xp.handler");

async function persistSubmission(frontendInput) {
  const { userId, levelNumber, language, code } = frontendInput;

  if (!userId || !levelNumber || !language || !code) {
    throw new Error("INVALID_SUBMISSION_REQUEST");
  }

  //  Fetch level
  const level = await Level.findOne({ levelNumber });
  if (!level) throw new Error("LEVEL_NOT_FOUND");

  // Fetch problem directly by levelNumber
  const problem = await Problem.findOne({ levelNumber });
  if (!problem) throw new Error("PROBLEM_NOT_FOUND");

  // Create submission record
  const submission = await createSubmission({
    ...frontendInput,
    problemId: problem._id,
  });

  // Build wrapped code
  const wrappedCode = buildWrappedCode({
    language,
    userCode: code,
    problem,
  });

  //Execute on Judge0
  const judgeResult = await executeCode({
    language,
    code: wrappedCode,
  });

  // Evaluate output
  const evaluation = evaluateSubmission(problem, judgeResult);

  submission.status = evaluation.verdict;
  submission.runtime = evaluation.runtime;
  submission.memory = evaluation.memory;
  await submission.save();

  // 7️⃣ Grant XP if accepted
  let xpEarned = 0;

  if (evaluation.verdict === "ACCEPTED") {
    xpEarned = await grantXPIfEligible(
      userId,
      levelNumber,
      problem.xpReward ?? 30,
    );
  }

  return {
    submissionId: submission._id,
    verdict: evaluation.verdict,
    runtime: evaluation.runtime,
    memory: evaluation.memory,
    xpEarned,
  };
}

module.exports = { persistSubmission };
