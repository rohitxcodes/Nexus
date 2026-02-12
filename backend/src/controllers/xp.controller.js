// In xp.controller.js
const xpService = require("../services/xp.service");

async function recordXP(req, res) {
  try {
    const userId = req.user.userId;
    const { levelNumber, amount } = req.body;

    console.log(`Recording XP - User: ${userId}, Level: ${levelNumber}, Amount: ${amount}`);

    if (!levelNumber || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const transaction = await xpService.recordXPTransaction(userId, levelNumber, amount);
    
    if (!transaction) {
      const user = await require("../models/user.model").findById(userId);
      return res.status(200).json({ 
        success: true,
        message: "XP already recorded",
        totalXP: user.totalXP
      });
    }

    const user = await require("../models/user.model").findById(userId).select("totalXP");
    return res.status(200).json({
      success: true,
      message: "XP recorded",
      totalXP: user.totalXP
    });
  } catch (err) {
    console.error("Error in recordXP:", err);
    return res.status(500).json({ error: "Failed to record XP" });
  }
}

module.exports = { recordXP };
