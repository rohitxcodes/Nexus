const Level = require("../../models/level.model");
const Problem = require("../../models/problem.model");
const User = require("../../models/user.model");

const { createSubmission } = require("./submission.service.creator");
const { buildWrappedCode } = require("./submission.service.wrapper");
const { executeCode } = require("./submission.service.client");
const { evaluateSubmission } = require("./submission.service.evaluator");
const { grantXPIfEligible } = require("./submission.service.xp.handler");
const { advanceLevel } = require("../progression.service");
const { checkSubmissionTrophies } = require("../trophy.service");

async function persistSubmission(frontendInput) {
  const { userId, levelNumber, language, code } = frontendInput;

  if (!userId || !levelNumber || !language || !code) {
    throw new Error("INVALID_SUBMISSION_REQUEST");
  }

  const level = await Level.findOne({ levelNumber });
  if (!level) throw new Error("LEVEL_NOT_FOUND");

  const problem = await Problem.findOne({ levelNumber });
  if (!problem) throw new Error("PROBLEM_NOT_FOUND");

  const submission = await createSubmission({
    ...frontendInput,
    problemId: problem._id,
  });

  const wrappedCode = buildWrappedCode({ language, userCode: code, problem });

  const judgeResult = await executeCode({ language, code: wrappedCode });

  const evaluation = evaluateSubmission(problem, judgeResult);

  submission.status = evaluation.verdict;
  submission.runtime = evaluation.runtime;
  submission.memory = evaluation.memory;
  await submission.save();

  let xpEarned = 0;

  if (evaluation.verdict === "ACCEPTED") {
    const XP_BY_DIFFICULTY = { Easy: 30, Medium: 60, Hard: 100 };
    const xpAmount = XP_BY_DIFFICULTY[problem.difficulty] ?? 30;
    xpEarned = await grantXPIfEligible(userId, levelNumber, xpAmount);
    await advanceLevel(userId, levelNumber);

    // Fetch updated user state AFTER XP and level update
    const updatedUser = await User.findById(userId)
      .select("totalXP completedLevels")
      .lean();

    // Check and award any trophies earned from this submission
    await checkSubmissionTrophies(
      userId,
      levelNumber,
      updatedUser.totalXP,
      updatedUser.completedLevels,
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
