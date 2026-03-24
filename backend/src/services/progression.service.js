const User = require("../models/user.model");

async function advanceLevel(userId, completedLevelNumber) {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  // Only advance if the completed level matches or exceeds currentLevel
  // This prevents going backwards
  if (completedLevelNumber >= user.currentLevel) {
    user.currentLevel = completedLevelNumber + 1;
    await user.save();
  }
}

module.exports = { advanceLevel };
