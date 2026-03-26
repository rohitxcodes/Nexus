const leaderboardService = require("../services/leaderbord.global.service");

const getLeaderboardOverview = async (req, res) => {
  try {
    const userId = req.user.userId;

    const data = await leaderboardService.getLeaderboardOverview(userId);

    res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    console.error("Leaderboard Overview Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch leaderboard",
    });
  }
};

const getClanLeaderboard = async (req, res) => {
  try {
    const { clanId } = req.params;
    const userId = req.user.userId;

    const data = await leaderboardService.getClanLeaderboard(clanId, userId);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Clan Leaderboard Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch clan leaderboard",
    });
  }
};

module.exports = {
  getLeaderboardOverview,
  getClanLeaderboard,
};
