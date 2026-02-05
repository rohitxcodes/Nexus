const express = require("express");
const router = express.Router();
const levelController = require("../controllers/level.controller");
const requireAuth = require("../middleware/auth.middleware");
router.get("/", requireAuth, levelController.getAllLevels);
router.get("/:levelNumber", requireAuth, levelController.getLevelByNumber);

module.exports = router;
