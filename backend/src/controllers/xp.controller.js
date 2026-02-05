const xpService = require("../services/xp.service");
async function getXPHistory(req, res, next) {
  try {
    const userId = req.user.userId;
    const history = await xpService.fetchXPHistory(userId);
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ Error: "xp transction failed" });
  }
}

module.exports = {
  getXPHistory,
};
