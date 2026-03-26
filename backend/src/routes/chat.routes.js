const express = require("express");
const router = express.Router();

const requireAuth = require("../middleware/auth.middleware");
const chatController = require("../controllers/chat.controller");

// Load last 50 messages on page open
router.get("/:clanId/history", requireAuth, chatController.getChatHistory);
// router.post("/:clanId/sendMessage",requireAuth,chatController.
// )

module.exports = router;
