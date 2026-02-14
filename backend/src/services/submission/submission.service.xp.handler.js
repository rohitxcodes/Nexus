// backend/src/services/submission/submission.service.xp.handler.js

const User = require("../../models/user.model");

async function grantXPIfEligible(userId, levelNumber, xpAmount) {
  if (!xpAmount || xpAmount <= 0) return 0;

  const updateResult = await User.updateOne(
    {
      _id: userId,
      completedLevels: { $ne: levelNumber },
    },
    {
      $addToSet: { completedLevels: levelNumber },
      $inc: { totalXP: xpAmount },
    },
  );

  return updateResult.modifiedCount === 1 ? xpAmount : 0;
}

module.exports = { grantXPIfEligible };
