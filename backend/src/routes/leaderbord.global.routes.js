const express = require("express");
const router = express.Router();

const leaderboardController = require("../controllers/leaderbord.global.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Get Top 10 + My Rank
router.get(
  "/overview",
  authMiddleware,
  leaderboardController.getLeaderboardOverview,
);

module.exports = router;
