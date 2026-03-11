const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  uploadResume,
  getResumeHistory,
  deleteResume,
} = require("../controllers/resumeController");

const router = express.Router();

// POST /api/resume/upload
router.post("/upload", protect, upload.single("resume"), uploadResume);

// GET /api/resume/history
router.get("/history", protect, getResumeHistory);

// DELETE /api/resume/:id
router.delete("/:id", protect, deleteResume);

module.exports = router;

