const Level = require("../models/level.model");
const User = require("../models/user.model");
async function fetchAllLevelsForUser(userId) {
  const levels = await Level.find({}).sort({ levelNumber: 1 });
  const user = await User.findById(userId).select(
    "currentLevel completedLevels",
  );
  if (!user) {
    throw new Error("User not found");
  }
  const completedSet = new Set(user.completedLevels || []);
  const result = levels.map((level) => {
    let status = "LOCKED";
    if (completedSet.has(level.levelNumber)) {
      status = "COMPLETED";
    } else if (level.levelNumber === user.currentLevel) {
      status = "UNLOCKED";
    }
    return {
      levelNumber: level.levelNumber,
      difficulty: level.difficulty,
      xpReward: level.xpReward,
      status,
    };
  });
  return result;
}
async function fetchLevelByNumber(levelNumber) {}
async function validateLevelCompletion(userId, levelNumber) {}
async function awardLevelXP(userId, levelNumber) {}
module.exports = {
  fetchLevelByNumber,
  fetchAllLevelsForUser,
  validateLevelCompletion,
  awardLevelXP,
};
