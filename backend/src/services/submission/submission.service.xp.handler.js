const User = require("../../models/user.model");

async function grantXPIfEligible(userId, levelNumber, xpAmount) {
  if (!xpAmount || xpAmount <= 0) return 0;

  // Check double XP BEFORE atomic update
  const user = await User.findById(userId).select("doubleXPRoundsLeft");
  if (!user) return 0;

  let finalAmount = xpAmount;

  if (user.doubleXPRoundsLeft > 0) {
    finalAmount = xpAmount * 2;
    await User.updateOne({ _id: userId }, { $inc: { doubleXPRoundsLeft: -1 } });
  }

  const updateResult = await User.updateOne(
    {
      _id: userId,
      completedLevels: { $ne: levelNumber },
    },
    {
      $addToSet: { completedLevels: levelNumber },
      $inc: { totalXP: finalAmount },
    },
  );

  return updateResult.modifiedCount === 1 ? finalAmount : 0;
}

module.exports = { grantXPIfEligible };
