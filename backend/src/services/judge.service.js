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

const languageMap = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

async function submitToJudge(language, code, input) {
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

async function pollResult(token) {
  const maxAttempts = 5;
  let attempts = 0;

  while (attempts < maxAttempts) {
    const res = await judge0.get(`/submissions/${token}?base64_encoded=false`);

    const statusId = res.data.status.id;

    if (statusId <= 2) {
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
      continue;
    }

    return res.data;
  }

  throw new Error("JUDGE_TIMEOUT");
}

function normalize(value) {
  return String(value ?? "")
    .replace(/\r\n/g, "\n")
    .trim();
}

function mapVerdict(desc) {
  const map = {
    Accepted: "ACCEPTED",
    "Wrong Answer": "WRONG_ANSWER",
    "Compilation Error": "ERROR",
    "Runtime Error": "ERROR",
    "Time Limit Exceeded": "ERROR",
  };

  return map[desc] || "ERROR";
}

async function evaluateProblem(problem, language, code) {
  let finalVerdict = "ACCEPTED";
  let runtimeMax = null;
  let memoryMax = null;

  for (const tc of problem.testCases) {
    const token = await submitToJudge(language, code, tc.input);
    const result = await pollResult(token);

    const verdict = mapVerdict(result.status.description);

    if (verdict === "ERROR") {
      finalVerdict = "ERROR";
      break;
    }

    const actual = normalize(result.stdout);
    const expected = normalize(tc.expectedOutput);

    if (actual !== expected) {
      finalVerdict = "WRONG_ANSWER";
      break;
    }

    const runtimeNum = Number(result.time);
    const memoryNum = Number(result.memory);

    if (!isNaN(runtimeNum)) {
      runtimeMax =
        runtimeMax == null ? runtimeNum : Math.max(runtimeMax, runtimeNum);
    }

    if (!isNaN(memoryNum)) {
      memoryMax =
        memoryMax == null ? memoryNum : Math.max(memoryMax, memoryNum);
    }
  }

  return {
    verdict: finalVerdict,
    runtime: runtimeMax,
    memory: memoryMax,
  };
}

module.exports = { evaluateProblem };
