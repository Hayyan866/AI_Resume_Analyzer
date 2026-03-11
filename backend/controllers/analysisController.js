const Resume = require("../models/Resume");
const {
  analyzeResumeWithAI,
  analyzeJobMatchWithAI,
} = require("../services/aiService");

// POST /api/analyze/resume
// Body: { resumeText: string, resumeId?: string }
const analyzeResume = async (req, res) => {
  const { resumeText, resumeId } = req.body;

  try {
    let text = resumeText;
    let resumeDoc = null;

    if (!text && resumeId) {
      resumeDoc = await Resume.findOne({
        _id: resumeId,
        userId: req.user._id,
      });
      if (!resumeDoc) {
        return res.status(404).json({ message: "Resume not found" });
      }
      text = resumeDoc.extractedText;
    }

    if (!text) {
      return res.status(400).json({ message: "Resume text is required" });
    }

    const analysis = await analyzeResumeWithAI(text);

    if (resumeId && resumeDoc) {
      resumeDoc.analysisResult = {
        ...(resumeDoc.analysisResult || {}),
        resumeAnalysis: {
          resumeScore: analysis.resumeScore,
          atsCompatibility: analysis.atsCompatibility,
          keywordOptimization: analysis.keywordOptimization,
          skillRelevance: analysis.skillRelevance,
          formattingReadability: analysis.formattingReadability,
          improvementSuggestions: analysis.improvementSuggestions,
          rawResponse: analysis.rawResponse,
        },
        jobMatches: resumeDoc.analysisResult?.jobMatches || [],
      };
      await resumeDoc.save();
    }

    res.json({
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (err) {
    console.error("Error analyzing resume:", err);

    // Check for OpenAI specific errors
    if (err.status === 429 || err.code === "insufficient_quota") {
      return res.status(402).json({
        message: "OpenAI Quota Exceeded. Please check your billing dashboard at platform.openai.com",
        error: "insufficient_quota"
      });
    }

    if (err.status === 401) {
      return res.status(401).json({
        message: "Invalid OpenAI API Key. Please check your backend configuration.",
        error: "invalid_api_key"
      });
    }

    res.status(500).json({
      message: "Failed to analyze resume",
      error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  }
};

// POST /api/analyze/job-match
// Body: { resumeText: string, jobDescription: string, resumeId?: string }
const analyzeJobMatch = async (req, res) => {
  const { resumeText, jobDescription, resumeId } = req.body;

  try {
    let text = resumeText;
    let resumeDoc = null;

    if (!text && resumeId) {
      resumeDoc = await Resume.findOne({
        _id: resumeId,
        userId: req.user._id,
      });
      if (!resumeDoc) {
        return res.status(404).json({ message: "Resume not found" });
      }
      text = resumeDoc.extractedText;
    }

    if (!text || !jobDescription) {
      return res
        .status(400)
        .json({ message: "Resume text and job description are required" });
    }

    const matchResult = await analyzeJobMatchWithAI(text, jobDescription);

    let storedMatch = null;
    if (resumeId && resumeDoc) {
      const newMatch = {
        jobDescription,
        matchPercentage: matchResult.matchPercentage,
        missingKeywords: matchResult.missingKeywords,
        suggestedImprovements: matchResult.suggestedImprovements,
      };

      resumeDoc.analysisResult = {
        ...(resumeDoc.analysisResult || {}),
        resumeAnalysis: resumeDoc.analysisResult?.resumeAnalysis,
        jobMatches: [...(resumeDoc.analysisResult?.jobMatches || []), newMatch],
      };

      await resumeDoc.save();
      storedMatch = newMatch;
    }

    res.json({
      message: "Job match analysis completed",
      match: storedMatch || matchResult,
    });
  } catch (err) {
    console.error("Error analyzing job match:", err);

    // Check for OpenAI specific errors
    if (err.status === 429 || err.code === "insufficient_quota") {
      return res.status(402).json({
        message: "OpenAI Quota Exceeded. Please check your billing dashboard at platform.openai.com",
        error: "insufficient_quota"
      });
    }

    if (err.status === 401) {
      return res.status(401).json({
        message: "Invalid OpenAI API Key. Please check your backend configuration.",
        error: "invalid_api_key"
      });
    }

    res.status(500).json({
      message: "Failed to analyze job match",
      error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  }
};

module.exports = {
  analyzeResume,
  analyzeJobMatch,
};

