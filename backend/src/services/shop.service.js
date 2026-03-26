const User = require("../models/user.model");
const Problem = require("../models/problem.model");
const ai = require("../config/gemini");

const HINT_COST = 50; // XP
const DEBUG_COST = 75; // XP

// ── Shared: deduct XP from user ───────────────────────────────
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

  return user.totalXP; // return updated balance
}

// ── Shared: call Gemini
async function callGemini(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
}

// ── AI Hint
// Costs 50 XP — gives a nudge without revealing the solution
async function getHint(userId, problemId) {
  const problem = await Problem.findById(problemId).lean();
  if (!problem) throw new Error("Problem not found");

  const remainingXP = await deductXP(userId, HINT_COST);

  const prompt = `
You are a DSA tutor helping a student solve a coding problem.

Problem Title: ${problem.title}
Difficulty: ${problem.difficulty}
Problem Description: ${problem.description}

Give ONE short, helpful hint that nudges the student in the right direction.
Rules:
- Do NOT reveal the solution or write any code
- Keep it under 3 sentences
- Focus on the approach or data structure to use
`;

  const hint = await callGemini(prompt);

  return {
    hint,
    xpDeducted: HINT_COST,
    remainingXP,
  };
}

// ── AI Debug
// Costs 75 XP — explains what's wrong with current code
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

Analyze the code and explain:
1. What is wrong or what edge cases are being missed
2. What concept or approach they should reconsider

Rules:
- Do NOT rewrite the solution or give the correct code
- Keep the explanation under 5 sentences
- Be specific about what's wrong in their code
`;

  const debug = await callGemini(prompt);

  return {
    debug,
    xpDeducted: DEBUG_COST,
    remainingXP,
  };
}

module.exports = { getHint, debugCode };
