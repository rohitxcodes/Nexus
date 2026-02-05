const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const requireAuth = require("../middleware/auth.middleware");
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/logout", requireAuth, authController.logoutUser);

module.exports = router;
