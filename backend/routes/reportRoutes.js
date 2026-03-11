const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { generatePdfReport } = require("../controllers/reportController");

const router = express.Router();

// GET /api/report/:resumeId/pdf
router.get("/:resumeId/pdf", protect, generatePdfReport);

module.exports = router;

