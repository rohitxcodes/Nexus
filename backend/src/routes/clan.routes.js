const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const clanController = require("../controllers/clan.controller");

// ── READ ──────────────────────────────────────────────────────
router.get("/", requireAuth, clanController.getAllClans);
router.get("/mine", requireAuth, clanController.getMyClan);
router.get("/:clanId", requireAuth, clanController.getClan);
router.get("/:clanId/requests", requireAuth, clanController.getPendingRequests);

// ── WRITE ─────────────────────────────────────────────────────
router.post("/", requireAuth, clanController.createClan);
router.post("/request", requireAuth, clanController.requestJoin);
router.post("/approve", requireAuth, clanController.approveRequest);
router.post("/reject", requireAuth, clanController.rejectRequest);
router.post("/add-members", requireAuth, clanController.addMembers);
router.post("/leave", requireAuth, clanController.leaveClan);
router.post("/remove-member", requireAuth, clanController.removeMember);
router.delete("/", requireAuth, clanController.deleteClan);

module.exports = router;
