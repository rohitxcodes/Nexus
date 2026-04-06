const User = require("../models/user.model");

const HINT_COST = 50;
const DEBUG_COST = 75;
const DOUBLE_XP_COST = 75;
const SKIP_LEVEL_COST = 100;

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

module.exports = {
  getHint,
  debugCode,
  buyDoubleXP,
  skipLevel,
  getCashBalance,
  addCash,
};
