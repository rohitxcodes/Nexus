const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const matchController = require("../controllers/match.controller");

// !! /history MUST be above /:matchId
// otherwise Express treats "history" as a matchId
router.get("/history", requireAuth, matchController.history);

router.post("/challenge", requireAuth, matchController.challenge);
router.post("/:matchId/accept", requireAuth, matchController.accept);
router.post("/:matchId/decline", requireAuth, matchController.decline);
router.post("/:matchId/submit", requireAuth, matchController.submitCode);
router.get("/:matchId", requireAuth, matchController.getMatch);

module.exports = router;
