const express = require("express");
const router = express.Router();
const matchController = require("../controllers/match.controller");
const requireAuth = require("../middleware/auth.middleware");

router.get("/matchId", requireAuth, matchController.getMatchById);
router.post("/", requireAuth, matchController.createMatch);

module.exports = router;
