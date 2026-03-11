const fs = require("fs");
const path = require("path");
const Resume = require("../models/Resume");
const { parseResume } = require("../services/resumeParser");
const { validateResume } = require("../utils/resumeValidator");

// POST /api/resume/upload
const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { file } = req;

  try {
    // Step 1: Extract text from the uploaded file
    const extractedText = await parseResume(file.path, file.mimetype);

    if (!extractedText || extractedText.trim().length === 0) {
      // Clean up the uploaded file
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res
        .status(400)
        .json({ message: "Unable to extract text from the uploaded file" });
    }

    // Step 2: Validate the document is actually a resume
    const validation = await validateResume(extractedText);

    if (!validation.valid) {
      // Clean up the uploaded file since we're rejecting it
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(422).json({
        error: "Uploaded document does not appear to be a resume.",
        reason: validation.reason,
      });
    }

    // Step 3: Save the validated resume to the database
    const resume = await Resume.create({
      userId: req.user._id,
      fileName: file.originalname,
      filePath: file.path,
      extractedText,
    });

    res.status(201).json({
      message: "Resume uploaded and parsed successfully",
      resume,
    });
  } catch (err) {
    // Clean up file on unexpected errors
    if (file?.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    return res
      .status(500)
      .json({ message: "Failed to process resume file", error: err.message });
  }
};

// GET /api/resume/history
const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ resumes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resume history" });
  }
};

// DELETE /api/resume/:id
const deleteResume = async (req, res) => {
  const { id } = req.params;

  try {
    const resume = await Resume.findOne({
      _id: id,
      userId: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Remove file from disk if it exists
    if (resume.filePath && fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    await resume.deleteOne();

    res.json({ message: "Resume deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resume" });
  }
};

module.exports = {
  uploadResume,
  getResumeHistory,
  deleteResume,
};

