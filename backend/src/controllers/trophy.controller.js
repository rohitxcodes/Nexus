const trophyService = require("../services/trophy.service");

// GET /api/trophies — all trophies with earned status
async function getAllTrophies(req, res) {
  try {
    const userId = req.user.userId;
    const trophies = await trophyService.getAllTrophies(userId);
    res.status(200).json({ success: true, trophies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// GET /api/trophies/mine — only earned trophies
async function getMyTrophies(req, res) {
  try {
    const userId = req.user.userId;
    const trophies = await trophyService.getMyTrophies(userId);
    res.status(200).json({ success: true, trophies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = { getAllTrophies, getMyTrophies };
