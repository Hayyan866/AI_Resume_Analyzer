const mongoose = require("mongoose");

const jobMatchSchema = new mongoose.Schema(
  {
    jobDescription: { type: String, required: true },
    matchPercentage: { type: Number, required: true },
    missingKeywords: [{ type: String }],
    suggestedImprovements: { type: String },
  },
  { _id: false, timestamps: { createdAt: true, updatedAt: false } }
);

const analysisResultSchema = new mongoose.Schema(
  {
    resumeAnalysis: {
      resumeScore: Number,
      atsCompatibility: String,
      keywordOptimization: String,
      skillRelevance: String,
      formattingReadability: String,
      improvementSuggestions: String,
      rawResponse: String,
    },
    jobMatches: [jobMatchSchema],
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    analysisResult: analysisResultSchema,
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

module.exports = Resume;

