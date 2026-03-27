const User = require("../models/user.model");
const Problem = require("../models/problem.model");
const Level = require("../models/level.model");
const ai = require("../config/gemini");

const HINT_COST = 50;
const DEBUG_COST = 75;
const DOUBLE_XP_COST = 75;
const SKIP_LEVEL_COST = 100;

async function deductXP(userId, amount) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.totalXP < amount) {
    throw new Error(
      `Not enough XP. You need ${amount} XP but have ${user.totalXP}`,
    );
  }
  user.totalXP -= amount;
  await user.save();
  return user.totalXP;
}

async function callGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text;
}

async function getHint(userId, problemId) {
  const problem = await Problem.findById(problemId).lean();
  if (!problem) throw new Error("Problem not found");

  const remainingXP = await deductXP(userId, HINT_COST);

  const prompt = `
You are a DSA tutor helping a student solve a coding problem.
Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}
Problem Description: ${problem.description}
Give ONE short helpful hint without revealing the solution.
Rules:
- Do NOT write any code
- Keep it under 3 sentences
- Focus on the approach or data structure to use
`;

  const hint = await callGemini(prompt);
  return { hint, xpDeducted: HINT_COST, remainingXP };
}

async function debugCode(userId, problemId, code, language) {
  if (!code || !code.trim()) throw new Error("Code cannot be empty");
  if (!language) throw new Error("Language is required");

  const problem = await Problem.findById(problemId).lean();
  if (!problem) throw new Error("Problem not found");

  const remainingXP = await deductXP(userId, DEBUG_COST);

  const prompt = `
You are a DSA tutor reviewing a student's code.
Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}
Problem Description: ${problem.description}
Student's ${language} code:
\`\`\`${language}
${code}
\`\`\`
Analyze and explain:
1. What is wrong or what edge cases are missed
2. What concept or approach they should reconsider
Rules:
- Do NOT rewrite the solution or give correct code
- Keep it under 5 sentences
- Be specific about what's wrong
`;

  const debug = await callGemini(prompt);
  return { debug, xpDeducted: DEBUG_COST, remainingXP };
}

async function buyDoubleXP(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.totalXP < DOUBLE_XP_COST) {
    throw new Error(
      `Not enough XP. You need ${DOUBLE_XP_COST} XP but have ${user.totalXP}`,
    );
  }

  user.totalXP -= DOUBLE_XP_COST;
  user.doubleXPRoundsLeft = (user.doubleXPRoundsLeft || 0) + 2;
  await user.save();

  return {
    message: "Double XP activated for 2 rounds",
    doubleXPRoundsLeft: user.doubleXPRoundsLeft,
    remainingXP: user.totalXP,
  };
}

async function skipLevel(userId) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.totalXP < SKIP_LEVEL_COST) {
    throw new Error(
      `Not enough XP. You need ${SKIP_LEVEL_COST} XP but have ${user.totalXP}`,
    );
  }

  const levelToSkip = user.currentLevel;

  if (user.completedLevels.includes(levelToSkip)) {
    throw new Error("Current level is already completed");
  }

  const level = await Level.findOne({ levelNumber: levelToSkip });
  if (!level) throw new Error("Level not found");

  user.totalXP -= SKIP_LEVEL_COST;
  user.completedLevels.push(levelToSkip);
  if (!user.skippedLevels) user.skippedLevels = [];
  user.skippedLevels.push(levelToSkip);
  user.currentLevel = levelToSkip + 1;
  await user.save();

  return {
    message: `Level ${levelToSkip} skipped`,
    skippedLevel: levelToSkip,
    newCurrentLevel: user.currentLevel,
    remainingXP: user.totalXP,
  };
}

async function getCashBalance(userId) {
  const user = await User.findById(userId).select("cash").lean();
  if (!user) throw new Error("User not found");
  return { cash: user.cash || 0 };
}

async function addCash(userId, amount) {
  if (!amount || amount <= 0) throw new Error("Invalid cash amount");
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  user.cash = (user.cash || 0) + amount;
  await user.save();
  return { message: `${amount} cash added`, cash: user.cash };
}

module.exports = {
  getHint,
  debugCode,
  buyDoubleXP,
  skipLevel,
  getCashBalance,
  addCash,
};
