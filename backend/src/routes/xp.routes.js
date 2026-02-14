const express = require("express");
const router = express.Router();
const xpController = require("../controllers/xp.controller");
const requireAuth = require("../middleware/auth.middleware");
router.post("/record", requireAuth, xpController.recordXP);

module.exports = router;
