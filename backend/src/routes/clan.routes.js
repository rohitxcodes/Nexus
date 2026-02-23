const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const clanController = require("../controllers/clan.controller");

router.post("/", requireAuth, clanController.createClan);
router.post("/request", requireAuth, clanController.requestJoin);
router.post("/approve", requireAuth, clanController.approveRequest);
router.post("/reject", requireAuth, clanController.rejectRequest);
router.get("/:clanId/requests", requireAuth, clanController.getPendingRequests);
router.delete("/", requireAuth, clanController.deleteClan);

module.exports = router;
