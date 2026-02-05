const User = require("../models/user.model");
const xpTransaction = require("../models/xpTransaction.model");
async function recordXPTransaction(userId, levelNumber, amount) {
  const exists = await xpTransaction.findOne({
    userId,
    levelNumber,
  });

  if (exists) return null;

  const transaction = await xpTransaction.create({
    userId,
    levelNumber,
    amount,
  });

  await User.findByIdAndUpdate(userId, {
    $inc: { totalXP: amount },
  });

  return transaction;
}
async function fetchXPHistory(userId) {
  try {
    const history = await xpTransaction
      .find({ userId })
      .sort({ createdAt: -1 });

    return history;
  } catch (err) {
    throw err;
  }
}
module.exports = { recordXPTransaction, fetchXPHistory };
