// backend/src/services/submission/submission.service.client.js

const axios = require("axios");

if (!process.env.RAPIDAPI_KEY) {
  throw new Error("RAPIDAPI_KEY missing");
}

const judgeClient = axios.create({
  baseURL: "https://judge0-ce.p.rapidapi.com",
  headers: {
    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    "Content-Type": "application/json",
  },
});

const LANGUAGE_MAP = {
  cpp: 54,
  java: 62,
  python: 71,
  javascript: 63,
};

async function executeCode({ language, code }) {
  const languageId = LANGUAGE_MAP[language];
  if (!languageId) throw new Error("UNSUPPORTED_LANGUAGE");

  const submitRes = await judgeClient.post(
    "/submissions?base64_encoded=false&wait=false",
    {
      source_code: code,
      language_id: languageId,
      stdin: "",
    },
  );

  const token = submitRes.data.token;

  const MAX_ATTEMPTS = 20;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    const resultRes = await judgeClient.get(
      `/submissions/${token}?base64_encoded=false`,
    );

    const statusId = resultRes.data.status.id;

    if (statusId <= 2) {
      await new Promise((r) => setTimeout(r, 1000));
      attempts++;
      continue;
    }

    return resultRes.data;
  }

  throw new Error("JUDGE_TIMEOUT");
}

module.exports = { executeCode };
