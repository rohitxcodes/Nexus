const express = require("express");
const router = express.Router();
const xpController = require("../controllers/xp.controller");
const requireAuth = require("../middleware/auth.middleware");

router.get("/history", requireAuth, xpController.getXPHistory);

module.exports = router;
