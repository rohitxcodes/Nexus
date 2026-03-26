const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const trophyController = require("../controllers/trophy.controller");

// GET /api/trophies — all 10 trophies + which ones you've earned
router.get("/", requireAuth, trophyController.getAllTrophies);

// GET /api/trophies/mine — only your earned trophies
router.get("/mine", requireAuth, trophyController.getMyTrophies);

module.exports = router;
