const Submission = require("../models/submission.model");
const Problem = require("../models/problem.model");
const User = require("../models/user.model");
const levelService = require("./level.service");
const xpService = require("./xp.service");
const axios = require("axios");

if (!process.env.RAPIDAPI_KEY) {
  throw new Error("RAPIDAPI_KEY missing");
}
const judge0 = axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "Content-Type": "application/json",
  },
});

async function submitCodeToJudge({ language, code, input = "" }) {
  const languageMap = {
    cpp: 54,
    c: 50,
    java: 62,
    python: 71,
    javascript: 63,
  };

  const res = await judge0.post(
    "/submissions?base64_encoded=false&wait=false",
    {
      source_code: code,
      language_id: languageMap[language],
      stdin: input,
    },
  );

  return res.data.token;
}

async function fetchJudgeResult(token) {
  const maxAttempts = 20; // ~20 sec
  let attempts = 0;

  while (attempts < maxAttempts) {
    const res = await judge0.get(`/submissions/${token}?base64_encoded=false`);

    const statusId = res.data.status.id;

    if (statusId <= 2) {
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
      continue;
    }

    return {
      status: res.data.status.description,
      runtime: res.data.time,
      memory: res.data.memory,
      stdout: res.data.stdout,
      stderr: res.data.stderr,
    };
  }

  throw new Error("JUDGE_TIMEOUT");
}

async function persistSubmission(data) {
  const { userId, levelNumber, language, code } = data;

  const levels = await levelService.fetchAllLevelsForUser(userId);
  const level = levels.find((l) => l.levelNumber === levelNumber);

  if (!level) throw new Error("LEVEL_NOT_FOUND");
  if (level.status === "LOCKED") {
    throw new Error("LEVEL_LOCKED");
  }

  const problem = await Problem.findOne({ levelNumber });
  if (!problem) throw new Error("PROBLEM_NOT_FOUND");

  const difficultyRewardMap = {
    Easy: 30,
    Medium: 40,
    Hard: 60,
  };
  const xpReward =
    difficultyRewardMap[problem.difficulty] ?? level?.xpReward ?? 0;

  const submission = await Submission.create({
    userId,
    problemId: problem._id,
    levelNumber,
    language,
    code,
    status: "PENDING",
  });

  function normalizeVerdict(judgeStatusDescription) {
    const map = {
      Accepted: "ACCEPTED",
      "Wrong Answer": "WRONG_ANSWER",
      "Compilation Error": "ERROR",
      "Runtime Error": "ERROR",
      "Time Limit Exceeded": "ERROR",
    };

    return map[judgeStatusDescription] || "ERROR";
  }

  function normalizeOutput(value) {
    return String(value ?? "")
      .replace(/\r\n/g, "\n")
      .trim();
  }

  let finalVerdict = "ACCEPTED";
  let runtimeMax = null;
  let memoryMax = null;

  const testCases = Array.isArray(problem.testCases) ? problem.testCases : [];
  if (testCases.length === 0) {
    finalVerdict = "ERROR";
  } else {
    for (const tc of testCases) {
      const expectedRaw = tc?.expectedOutput ?? tc?.output;
      if (expectedRaw == null) {
        finalVerdict = "ERROR";
        break;
      }

      const judgeToken = await submitCodeToJudge({
        language,
        code,
        input: tc.input,
      });
      const result = await fetchJudgeResult(judgeToken);

      const verdict = normalizeVerdict(result.status);
      const runtimeNum = result.runtime != null ? Number(result.runtime) : NaN;
      const memoryNum = result.memory != null ? Number(result.memory) : NaN;

      if (!Number.isNaN(runtimeNum)) {
        runtimeMax = runtimeMax == null ? runtimeNum : Math.max(runtimeMax, runtimeNum);
      }
      if (!Number.isNaN(memoryNum)) {
        memoryMax = memoryMax == null ? memoryNum : Math.max(memoryMax, memoryNum);
      }

      if (verdict === "ERROR") {
        finalVerdict = "ERROR";
        break;
      }

      const actual = normalizeOutput(result.stdout);
      const expected = normalizeOutput(expectedRaw);
      if (actual !== expected) {
        finalVerdict = "WRONG_ANSWER";
        break;
      }
    }
  }

  submission.status = finalVerdict;
  submission.runtime = runtimeMax == null ? null : String(runtimeMax);
  submission.memory = memoryMax == null ? null : String(memoryMax);
  await submission.save();

  let xpEarned = 0;
  let totalXP = undefined;

  if (submission.status === "ACCEPTED") {
    const user = await User.findById(userId);

    const isFirstCompletion = !user.completedLevels.includes(levelNumber);

    if (isFirstCompletion) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { completedLevels: levelNumber },
        $set: { currentLevel: levelNumber + 1 },
      });

      await xpService.recordXPTransaction(userId, levelNumber, xpReward);
      xpEarned = xpReward;
    }

  }

  const updatedUser = await User.findById(userId).select("totalXP");
  totalXP = updatedUser?.totalXP;
  return {
    submissionId: submission._id,
    verdict: submission.status,
    xpEarned,
    totalXP,
  };
}

module.exports = {
  submitCodeToJudge,
  fetchJudgeResult,
  persistSubmission,
};
