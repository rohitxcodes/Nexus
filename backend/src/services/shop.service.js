const User = require("../models/user.model");
const ai = require("../config/gemini");
const Problem = require("../models/problem.model");
const { advanceLevel } = require("./progression.service");

const HINT_COST = 50;
const DEBUG_COST = 75;
const DOUBLE_XP_COST = 75;
const SKIP_LEVEL_COST = 100;

function buildFallbackHint({ title, language, codeSnippet }) {
  const hasCode = Boolean(codeSnippet && String(codeSnippet).trim());

  if (!hasCode) {
    return `Start by writing a simple ${language} solution for ${title}: handle base/edge cases first, then optimize.`;
  }

  return [
    `Could not reach AI service right now, but here is a useful hint for ${title}:`,
    "1) Compare your current logic against the smallest edge case and one max-size case.",
    "2) Print intermediate values around your loop/condition to verify invariants.",
    "3) Re-check off-by-one boundaries and empty input handling.",
  ].join(" ");
}

function formatAiFailureMessage(error) {
  const raw =
    error?.message ||
    error?.error?.message ||
    "AI hint service is temporarily unavailable.";
  const lowered = String(raw).toLowerCase();

  if (
    lowered.includes("quota") ||
    lowered.includes("rate") ||
    lowered.includes("resource_exhausted") ||
    lowered.includes("429")
  ) {
    return "AI hint quota reached. Please try again in a minute.";
  }

  return "AI hint service is temporarily unavailable. Please retry shortly.";
}

function recordPurchase(user, itemKey, amount = 1) {
  const levelKey = String(user.currentLevel || 1);
  const purchases =
    user.purchases && typeof user.purchases === "object"
      ? { ...user.purchases }
      : {};

  const levelPurchases =
    purchases[levelKey] && typeof purchases[levelKey] === "object"
      ? { ...purchases[levelKey] }
      : {};

  const currentCount = Number(levelPurchases[itemKey] || 0);
  levelPurchases[itemKey] = currentCount + Number(amount || 0);

  purchases[levelKey] = levelPurchases;
  user.purchases = purchases;

  // purchases is a Mixed field, so nested object updates must be marked manually.
  user.markModified("purchases");
}

function getTotalOwned(purchases, itemKey) {
  return Object.values(purchases || {}).reduce((sum, bucket) => {
    if (!bucket || typeof bucket !== "object") return sum;
    return sum + Number(bucket[itemKey] || 0);
  }, 0);
}

function consumePurchase(user, itemKey, amount = 1) {
  const decrementBy = Number(amount || 0);
  if (decrementBy <= 0) throw new Error("Invalid consumption amount");

  const purchases =
    user.purchases && typeof user.purchases === "object"
      ? { ...user.purchases }
      : {};

  const levelKeys = Object.keys(purchases);
  const currentLevelKey = String(user.currentLevel || 1);
  const orderedLevelKeys = [
    currentLevelKey,
    ...levelKeys.filter((key) => key !== currentLevelKey),
  ];

  const totalOwned = getTotalOwned(purchases, itemKey);
  if (totalOwned < decrementBy) {
    throw new Error(`No ${itemKey} uses available. Buy it from shop first.`);
  }

  let remainingToConsume = decrementBy;

  for (const key of orderedLevelKeys) {
    if (remainingToConsume <= 0) break;

    const levelBucket = purchases[key];
    if (!levelBucket || typeof levelBucket !== "object") continue;

    const owned = Number(levelBucket[itemKey] || 0);
    if (owned <= 0) continue;

    const toTake = Math.min(owned, remainingToConsume);
    const nextOwned = owned - toTake;

    purchases[key] = {
      ...levelBucket,
      [itemKey]: nextOwned,
    };

    remainingToConsume -= toTake;
  }

  user.purchases = purchases;
  user.markModified("purchases");

  return {
    remainingOwnedTotal: getTotalOwned(purchases, itemKey),
  };
}

async function purchaseItem(userId, itemKey, cost, message) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.totalXP < cost) {
    throw new Error(
      `Not enough XP. You need ${cost} XP but have ${user.totalXP}`,
    );
  }
  user.totalXP -= cost;
  recordPurchase(user, itemKey, 1);
  const levelKey = String(user.currentLevel || 1);
  const owned = Number(user.purchases?.[levelKey]?.[itemKey] || 0);
  await user.save();

  return {
    message,
    xpDeducted: cost,
    remainingXP: user.totalXP,
    purchasedItem: itemKey,
    currentLevel: user.currentLevel,
    ownedForCurrentLevel: owned,
  };
}

async function getHint(userId) {
  return purchaseItem(
    userId,
    "hint",
    HINT_COST,
    "AI Hint purchased and added to your inventory",
  );
}

async function invokeHint(userId, payload = {}) {
  const user = await User.findById(userId).select("purchases").lean();
  if (!user) throw new Error("User not found");

  const allPurchases =
    user.purchases && typeof user.purchases === "object" ? user.purchases : {};

  const totalHintsOwned = Object.values(allPurchases).reduce((sum, bucket) => {
    if (!bucket || typeof bucket !== "object") return sum;
    return sum + Number(bucket.hint || 0);
  }, 0);

  if (totalHintsOwned <= 0) {
    throw new Error("You do not own AI Hint. Buy it from shop first.");
  }

  const {
    codeSnippet,
    language = "javascript",
    problemId,
    levelNumber,
    problemTitle,
    problemDescription,
    constraints,
    examples,
  } = payload;

  let resolvedProblem = null;
  if (problemId) {
    resolvedProblem = await Problem.findById(problemId)
      .select("title description constraints examples")
      .lean();
  } else if (levelNumber) {
    resolvedProblem = await Problem.findOne({
      levelNumber: Number(levelNumber),
    })
      .select("title description constraints examples")
      .lean();
  }

  const title = resolvedProblem?.title || problemTitle || "Untitled Problem";
  const description =
    resolvedProblem?.description ||
    problemDescription ||
    "No description provided";
  const resolvedConstraints = resolvedProblem?.constraints || constraints || "";
  const resolvedExamples = Array.isArray(resolvedProblem?.examples)
    ? resolvedProblem.examples
    : Array.isArray(examples)
      ? examples
      : [];

  const prompt = [
    "You are a coding mentor.",
    "Give exactly 1 concise hint and do not provide the full solution.",
    "Focus on approach, edge cases, or bug direction.",
    "",
    `Language: ${language}`,
    `Problem Title: ${title}`,
    `Problem Description: ${description}`,
    resolvedConstraints ? `Constraints: ${resolvedConstraints}` : "",
    resolvedExamples.length
      ? `Examples: ${JSON.stringify(resolvedExamples.slice(0, 3))}`
      : "",
    "",
    "User Code:",
    codeSnippet || "(empty)",
  ]
    .filter(Boolean)
    .join("\n");

  if (!process.env.GEMINI_API_KEY) {
    return {
      message: "AI Hint generated",
      hint: "Hint service is not fully configured on server (missing GEMINI_API_KEY).",
    };
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const hint =
      aiResponse?.text ||
      aiResponse?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n")
        .trim() ||
      "Try breaking the task into smaller steps and validate with edge cases.";

    return {
      message: "AI Hint generated",
      hint,
      source: "gemini",
    };
  } catch (error) {
    return {
      message: formatAiFailureMessage(error),
      hint: buildFallbackHint({
        title,
        language,
        codeSnippet,
      }),
      source: "fallback",
    };
  }
}

async function invokeDebug(userId, payload = {}) {
  const user = await User.findById(userId).select("purchases").lean();
  if (!user) throw new Error("User not found");

  const allPurchases =
    user.purchases && typeof user.purchases === "object" ? user.purchases : {};

  const totalDebugOwned = Object.values(allPurchases).reduce((sum, bucket) => {
    if (!bucket || typeof bucket !== "object") return sum;
    return sum + Number(bucket.debug || 0);
  }, 0);

  if (totalDebugOwned <= 0) {
    throw new Error("You do not own AI Debugging. Buy it from shop first.");
  }

  const {
    codeSnippet,
    language = "javascript",
    problemId,
    levelNumber,
    problemTitle,
    problemDescription,
    constraints,
    examples,
  } = payload;

  let resolvedProblem = null;
  if (problemId) {
    resolvedProblem = await Problem.findById(problemId)
      .select("title description constraints examples")
      .lean();
  } else if (levelNumber) {
    resolvedProblem = await Problem.findOne({
      levelNumber: Number(levelNumber),
    })
      .select("title description constraints examples")
      .lean();
  }

  const title = resolvedProblem?.title || problemTitle || "Untitled Problem";
  const description =
    resolvedProblem?.description ||
    problemDescription ||
    "No description provided";
  const resolvedConstraints = resolvedProblem?.constraints || constraints || "";
  const resolvedExamples = Array.isArray(resolvedProblem?.examples)
    ? resolvedProblem.examples
    : Array.isArray(examples)
      ? examples
      : [];

  const prompt = [
    "You are an expert debugging mentor.",
    "Analyze the user's code for this coding problem.",
    "Return concise feedback with: probable bug, why it fails, and one fix direction.",
    "Do not return a full final solution.",
    "",
    `Language: ${language}`,
    `Problem Title: ${title}`,
    `Problem Description: ${description}`,
    resolvedConstraints ? `Constraints: ${resolvedConstraints}` : "",
    resolvedExamples.length
      ? `Examples: ${JSON.stringify(resolvedExamples.slice(0, 3))}`
      : "",
    "",
    "User Code:",
    codeSnippet || "(empty)",
  ]
    .filter(Boolean)
    .join("\n");

  if (!process.env.GEMINI_API_KEY) {
    return {
      message: "AI Debug generated",
      debug:
        "Debug service is not fully configured on server (missing GEMINI_API_KEY).",
    };
  }

  try {
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const debug =
      aiResponse?.text ||
      aiResponse?.candidates?.[0]?.content?.parts
        ?.map((part) => part?.text || "")
        .join("\n")
        .trim() ||
      "Check loop boundaries and edge-case handling; log intermediate states to isolate the bug.";

    return {
      message: "AI Debug generated",
      debug,
      source: "gemini",
    };
  } catch (error) {
    return {
      message: formatAiFailureMessage(error),
      debug:
        "Could not reach AI debug service right now. Check edge cases, boundary conditions, and variable updates inside your main loop.",
      source: "fallback",
    };
  }
}

async function debugCode(userId) {
  return purchaseItem(
    userId,
    "debug",
    DEBUG_COST,
    "AI Debugging purchased and added to your inventory",
  );
}

async function buyDoubleXP(userId) {
  return purchaseItem(
    userId,
    "doubleXp",
    DOUBLE_XP_COST,
    "Double XP purchased and added to your inventory",
  );
}

async function skipLevel(userId) {
  return purchaseItem(
    userId,
    "skip",
    SKIP_LEVEL_COST,
    "Skip Level purchased and added to your inventory",
  );
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

async function usePower(userId, payload = {}) {
  const {
    itemKey,
    codeSnippet,
    language,
    problemId,
    levelNumber,
    problemTitle,
    problemDescription,
    constraints,
    examples,
  } = payload;
  const allowedItems = new Set(["hint", "debug", "doubleXp", "skip"]);

  if (!allowedItems.has(itemKey)) {
    throw new Error("Invalid itemKey");
  }

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const levelBeforeUse = Number(user.currentLevel || 1);
  const requestedLevel = Number(levelNumber);
  const playedLevel =
    Number.isFinite(requestedLevel) && requestedLevel > 0
      ? requestedLevel
      : levelBeforeUse;

  const { remainingOwnedTotal } = consumePurchase(user, itemKey, 1);
  await user.save();

  if (itemKey === "skip") {
    const completedSet = new Set(
      Array.isArray(user.completedLevels) ? user.completedLevels : [],
    );
    const isReplaySkip =
      playedLevel < levelBeforeUse || completedSet.has(playedLevel);

    if (isReplaySkip) {
      return {
        message: "Level skipped (replay mode)",
        usedItem: itemKey,
        remainingOwnedTotal,
        previousLevel: playedLevel,
        nextLevel: playedLevel + 1,
        replaySkip: true,
      };
    }

    const freshUser = await User.findById(userId);
    if (!freshUser) throw new Error("User not found");

    const completedLevelNumber = playedLevel;
    await advanceLevel(userId, completedLevelNumber);

    const afterAdvance = await User.findById(userId)
      .select("currentLevel skippedLevels completedLevels")
      .lean();

    const skippedLevels = Array.isArray(afterAdvance?.skippedLevels)
      ? afterAdvance.skippedLevels
      : [];

    const completedLevels = Array.isArray(afterAdvance?.completedLevels)
      ? afterAdvance.completedLevels
      : [];

    const needsSkippedUpdate = !skippedLevels.includes(playedLevel);
    const needsCompletedUpdate = !completedLevels.includes(playedLevel);

    if (needsSkippedUpdate || needsCompletedUpdate) {
      const addToSet = {};
      if (needsSkippedUpdate) addToSet.skippedLevels = playedLevel;
      if (needsCompletedUpdate) addToSet.completedLevels = playedLevel;

      await User.updateOne({ _id: userId }, { $addToSet: addToSet });
    }

    return {
      message: "Level skipped successfully",
      usedItem: itemKey,
      remainingOwnedTotal,
      previousLevel: playedLevel,
      nextLevel: Number(afterAdvance?.currentLevel || playedLevel + 1),
    };
  }

  if (itemKey === "doubleXp") {
    await User.updateOne({ _id: userId }, { $inc: { doubleXPRoundsLeft: 1 } });

    const afterBoost = await User.findById(userId)
      .select("doubleXPRoundsLeft")
      .lean();

    return {
      message: "Double XP activated for your next eligible accepted submission",
      usedItem: itemKey,
      remainingOwnedTotal,
      doubleXPRoundsLeft: Number(afterBoost?.doubleXPRoundsLeft || 0),
    };
  }

  if (itemKey !== "hint" && itemKey !== "debug") {
    return {
      message: `${itemKey} used successfully`,
      usedItem: itemKey,
      remainingOwnedTotal,
    };
  }

  if (itemKey === "debug") {
    const debugResult = await invokeDebug(userId, {
      codeSnippet,
      language,
      problemId,
      levelNumber,
      problemTitle,
      problemDescription,
      constraints,
      examples,
    });

    return {
      ...debugResult,
      usedItem: itemKey,
      remainingOwnedTotal,
    };
  }

  const hintResult = await invokeHint(userId, {
    codeSnippet,
    language,
    problemId,
    levelNumber,
    problemTitle,
    problemDescription,
    constraints,
    examples,
  });

  return {
    ...hintResult,
    usedItem: itemKey,
    remainingOwnedTotal,
  };
}

module.exports = {
  getHint,
  invokeHint,
  invokeDebug,
  usePower,
  debugCode,
  buyDoubleXP,
  skipLevel,
  getCashBalance,
  addCash,
};
