const levelService = require("../services/level.service");
const Problem = require("../models/problem.model");
async function getAllLevels(req, res, next) {
  try {
    const userId = req.user.userId;
    const levels = await levelService.fetchAllLevelsForUser(userId);
    return res.status(200).json(levels);
  } catch (err) {
    console.error("GET LEVELS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch levels" });
  }
}
async function getLevelByNumber(req, res, next) {
  const userId = req.user.userId;
  const levelNumber = Number(req.params.levelNumber);
  if (isNaN(levelNumber)) {
    return res.status(400).json({ message: "Invalid level number" });
  }
  const levels = await levelService.fetchAllLevelsForUser(userId);
  const level = levels.find((l) => l.levelNumber === levelNumber);

  if (!level) {
    return res.status(404).json({ message: "Level not found" });
  }

  if (level.status === "LOCKED") {
    return res.status(403).json({ message: "Level is locked" });
  }
  const problem = await Problem.findOne({ levelNumber }).select(
    "title description difficulty tags constraints examples",
  );
  if (!problem) {
    return res.status(404).json({ message: "Problem not found" });
  }
  return res.status(200).json({
    levelNumber: level.levelNumber,
    status: level.status,
    xpReward: level.xpReward,
    problem,
  });
}
async function completeLevel(req, res, next) {
  return res.send("ok");
}

module.exports = {
  getAllLevels,
  getLevelByNumber,
  completeLevel,
};
