const User = require("../../models/user.model");

async function grantXPIfEligible(userId, levelNumber, xpAmount) {
  if (!xpAmount || xpAmount <= 0) return 0;

  // Read booster state first; it will be decremented only if XP grant succeeds.
  const user = await User.findById(userId).select("doubleXPRoundsLeft");
  if (!user) return 0;

  const hasDoubleXP = Number(user.doubleXPRoundsLeft || 0) > 0;
  const finalAmount = hasDoubleXP ? xpAmount * 2 : xpAmount;

  const updateOps = {
    $addToSet: { completedLevels: levelNumber },
    $inc: { totalXP: finalAmount },
  };

  if (hasDoubleXP) {
    updateOps.$inc.doubleXPRoundsLeft = -1;
  }

  const updateResult = await User.updateOne(
    {
      _id: userId,
      completedLevels: { $ne: levelNumber },
    },
    updateOps,
  );

  return updateResult.modifiedCount === 1 ? finalAmount : 0;
}

module.exports = { grantXPIfEligible };
