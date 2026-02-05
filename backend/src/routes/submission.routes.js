const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submission.controller");
const requireAuth = require("../middleware/auth.middleware");

router.post("/", requireAuth, submissionController.createSubmission);
router.get(
  "/:submissionId",
  requireAuth,
  submissionController.getSubmissionResult,
);

module.exports = router;
