const User = require("../models/user.model");
const Clan = require("../models/clan.model");
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

const getClanLeaderboard = async (clanId, requestingUserId) => {
  const clan = await Clan.findById(clanId).lean();
  if (!clan) throw new Error("Clan not found");

  // Fetch all members sorted by XP desc → currentLevel desc → username asc
  const members = await User.find({ clan: clanId })
    .select("username totalXP currentLevel completedLevels createdAt")
    .sort({ totalXP: -1, currentLevel: -1, username: 1 })
    .lean();

  if (members.length === 0) throw new Error("No members in this clan");

  // Assign rank by position in sorted array
  const rankedMembers = members.map((m, i) => ({
    rank: i + 1,
    username: m.username,
    totalXP: m.totalXP,
    currentLevel: m.currentLevel,
    levelsCompleted: m.completedLevels.length,
    isAdmin: clan.admin.toString() === m._id.toString(),
  }));

  // Find requesting user's rank
  const myEntry = rankedMembers.find(
    (m) => members[m.rank - 1]._id.toString() === requestingUserId.toString(),
  );

  return {
    clanName: clan.name,
    totalMembers: rankedMembers.length,
    leaderboard: rankedMembers,
    myRank: myEntry ? myEntry.rank : null,
  };
};

module.exports = {
  getLeaderboardOverview,
  getClanLeaderboard,
};
