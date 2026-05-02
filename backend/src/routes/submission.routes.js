const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submission.controller");
const requireAuth = require("../middleware/auth.middleware");
const submissionRateLimit = require("../middleware/submissionRateLimit.middleware");

router.post(
  "/",
  requireAuth,
  submissionRateLimit,
  submissionController.createSubmission,
);
router.get(
  "/:submissionId",
  requireAuth,
  submissionController.getSubmissionResult,
);

module.exports = router;
