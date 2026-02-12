// In xp.routes.js
const express = require("express");
const router = express.Router();
const xpController = require("../controllers/xp.controller");
const requireAuth = require("../middleware/auth.middleware");

// Make sure this route matches what you're calling from the frontend
router.post("/record", requireAuth, xpController.recordXP);

module.exports = router;
