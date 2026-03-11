const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  analyzeResume,
  analyzeJobMatch,
} = require("../controllers/analysisController");
const {
  analyzeResumeValidation,
  analyzeJobMatchValidation,
  validate,
} = require("../utils/validators");

const router = express.Router();

// POST /api/analyze/resume
router.post("/resume", protect, analyzeResumeValidation, validate, analyzeResume);

// POST /api/analyze/job-match
router.post(
  "/job-match",
  protect,
  analyzeJobMatchValidation,
  validate,
  analyzeJobMatch
);

module.exports = router;

