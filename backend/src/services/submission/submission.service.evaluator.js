// backend/src/services/submission/submission.service.evaluator.js

function normalize(value) {
  return String(value ?? "")
    .replace(/\s+/g, "")
    .trim();
}

function evaluateSubmission(problem, judgeResult) {
  if (!judgeResult || !judgeResult.stdout) {
    return {
      verdict: "ERROR",
      runtime: judgeResult?.time ?? null,
      memory: judgeResult?.memory ?? null,
    };
  }

  const actualOutputs = judgeResult.stdout
    .trim()
    .split("\n")
    .map((line) => normalize(line));

  const expectedOutputs = problem.testCases.map((tc) =>
    normalize(tc.expectedOutput),
  );

  if (actualOutputs.length !== expectedOutputs.length) {
    return {
      verdict: "WRONG_ANSWER",
      runtime: judgeResult.time ?? null,
      memory: judgeResult.memory ?? null,
    };
  }

  for (let i = 0; i < expectedOutputs.length; i++) {
    if (actualOutputs[i] !== expectedOutputs[i]) {
      return {
        verdict: "WRONG_ANSWER",
        runtime: judgeResult.time ?? null,
        memory: judgeResult.memory ?? null,
      };
    }
  }

  return {
    verdict: "ACCEPTED",
    runtime: judgeResult.time ?? null,
    memory: judgeResult.memory ?? null,
  };
}

module.exports = { evaluateSubmission };
