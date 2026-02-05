const express = require("express");
const router = express.Router();
const levelController = require("../controllers/problem.controller");
const requireAuth = require("../middleware/auth.middleware");

router.get("/:problemId", requireAuth, levelController.getProblemById);

module.exports = router;
