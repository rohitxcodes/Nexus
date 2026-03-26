const shopService = require("../services/shop.service");

// POST /api/shop/hint
async function getHint(req, res) {
  try {
    const userId = req.user.userId;
    const { problemId } = req.body;

    if (!problemId) {
      return res
        .status(400)
        .json({ success: false, message: "problemId is required" });
    }

    const result = await shopService.getHint(userId, problemId);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// POST /api/shop/debug
async function debugCode(req, res) {
  try {
    const userId = req.user.userId;
    const { problemId, code, language } = req.body;

    if (!problemId || !code || !language) {
      return res.status(400).json({
        success: false,
        message: "problemId, code and language are required",
      });
    }

    const result = await shopService.debugCode(
      userId,
      problemId,
      code,
      language,
    );
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

module.exports = { getHint, debugCode };
