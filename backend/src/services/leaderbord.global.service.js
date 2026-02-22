const User = require("../models/user.model");

const getLeaderboardOverview = async (userId) => {
  // Get Top 10 users
  const top10Users = await User.find(
    {},
    "username totalXP currentLevel createdAt",
  )
    .sort({ totalXP: -1, createdAt: 1 }) // deterministic ranking
    .limit(10)
    .lean();

  const rankedTop10 = top10Users.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

  //  Get current user
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    throw new Error("User not found");
  }

  //  Calculate user's global rank
  const higherUsersCount = await User.countDocuments({
    $or: [
      { totalXP: { $gt: currentUser.totalXP } },
      {
        totalXP: currentUser.totalXP,
        createdAt: { $lt: currentUser.createdAt },
      },
    ],
  });

  const myRank = higherUsersCount + 1;

  return {
    top10: rankedTop10,
    me: {
      rank: myRank,
      totalXP: currentUser.totalXP,
      currentLevel: currentUser.currentLevel,
    },
  };
};

module.exports = {
  getLeaderboardOverview,
};
