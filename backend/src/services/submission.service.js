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

  const submission = await Submission.create({
    userId,
    problemId: problem._id,
    levelNumber,
    language,
    code,
    status: "PENDING",
  });
  const testInput = problem.testCases[0].input;
  const judgeToken = await submitCodeToJudge({
    language,
    code,
    input: testInput,
  });
  const result = await fetchJudgeResult(judgeToken);

  function normalizeStatus(judgeStatus) {
    const map = {
      Accepted: "ACCEPTED",
      "Wrong Answer": "WRONG_ANSWER",
      "Compilation Error": "ERROR",
      "Runtime Error": "ERROR",
      "Time Limit Exceeded": "ERROR",
    };

    return map[judgeStatus] || "ERROR";
  }
  submission.status = normalizeStatus(result.status);
  submission.runtime = result.runtime || null;
  submission.memory = result.memory || null;
  await submission.save();

  if (result.status.toLowerCase() === "accepted") {
    const user = await User.findById(userId);

    const isFirstCompletion = !user.completedLevels.includes(levelNumber);

    if (isFirstCompletion) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { completedLevels: levelNumber },
        $set: { currentLevel: levelNumber + 1 },
      });

      await xpService.recordXPTransaction(userId, levelNumber, level.xpReward);
    }
  }
  return {
    submissionId: submission._id,
    verdict: submission.status,
  };
}

module.exports = {
  submitCodeToJudge,
  fetchJudgeResult,
  persistSubmission,
};
