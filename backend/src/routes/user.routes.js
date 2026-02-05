const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const requireAuth = require("../middleware/auth.middleware");
router.get("/profile", requireAuth, userController.getUserProfile);
router.get("/progress", requireAuth, userController.getUserProgress);
module.exports = router;
