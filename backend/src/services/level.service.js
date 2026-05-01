const Level = require("../models/level.model");
const User = require("../models/user.model");
const Problem = require("../models/problem.model");
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
      topic: level.topic || "Arcade",
      status,
    };
  });
  return result;
}

async function fetchLevelsByTopic(userId, topic) {
  const normalizedTopic = String(topic || "Arcade").trim();
  const topicKey = normalizedTopic.toLowerCase();

  let levels;
  if (topicKey === "arcade") {
    levels = await Level.find({}).sort({ levelNumber: 1 });
  } else {
    const escapedTopic = normalizedTopic.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const topicVariants = [
      normalizedTopic,
      normalizedTopic.replace(/\s+/g, ""),
      normalizedTopic.replace(/\s+/g, "-"),
      normalizedTopic.replace(/\s+/g, "_"),
    ];

    const tagRegexes = topicVariants.map(
      (value) =>
        new RegExp(`^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i"),
    );

    const levelNumbers = await Problem.distinct("levelNumber", {
      tags: { $in: tagRegexes },
    });

    levels = await Level.find({ levelNumber: { $in: levelNumbers } }).sort({
      levelNumber: 1,
    });
  }
  let user = null;
  if (userId) {
    user = await User.findById(userId).select("currentLevel completedLevels");
  }

  const completedSet = new Set(user?.completedLevels || []);
  const currentLevel = Number(user?.currentLevel || 1);

  const result = levels.map((level) => {
    let status = "LOCKED";
    if (completedSet.has(level.levelNumber)) {
      status = "COMPLETED";
    } else if (level.levelNumber === currentLevel) {
      status = "UNLOCKED";
    }
    return {
      levelNumber: level.levelNumber,
      difficulty: level.difficulty,
      xpReward: level.xpReward,
      topic: normalizedTopic,
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
  fetchLevelsByTopic,
  validateLevelCompletion,
  awardLevelXP,
};
