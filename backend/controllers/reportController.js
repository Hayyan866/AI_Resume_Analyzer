const PDFDocument = require("pdfkit");
const Resume = require("../models/Resume");

// GET /api/report/:resumeId/pdf
const generatePdfReport = async (req, res) => {
  const { resumeId } = req.params;

  try {
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    }).lean();

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (!resume.analysisResult || !resume.analysisResult.resumeAnalysis) {
      return res
        .status(400)
        .json({ message: "No analysis found for this resume" });
    }

    const analysis = resume.analysisResult.resumeAnalysis;
    const jobMatches = resume.analysisResult.jobMatches || [];

    const doc = new PDFDocument({ margin: 50 });

    const fileNameSafe = (resume.fileName || "resume")
      .toLowerCase()
      .replace(/\s+/g, "-");

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${fileNameSafe}-analysis-report.pdf"`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    doc.fontSize(20).text("AI Resume Analyzer Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`File: ${resume.fileName}`);
    doc.text(`Created At: ${new Date(resume.createdAt).toLocaleString()}`);
    doc.moveDown();

    doc.fontSize(16).text("Overall Resume Score", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(14).text(`Score: ${analysis.resumeScore} / 100`);
    doc.moveDown();

    doc.fontSize(16).text("ATS Compatibility", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(analysis.atsCompatibility || "N/A");
    doc.moveDown();

    doc.fontSize(16).text("Keyword Optimization", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(analysis.keywordOptimization || "N/A");
    doc.moveDown();

    doc.fontSize(16).text("Skill Relevance", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(analysis.skillRelevance || "N/A");
    doc.moveDown();

    doc.fontSize(16).text("Formatting & Readability", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(analysis.formattingReadability || "N/A");
    doc.moveDown();

    doc.fontSize(16).text("Improvement Suggestions", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).text(analysis.improvementSuggestions || "N/A", {
      align: "left",
    });
    doc.moveDown();

    if (jobMatches.length > 0) {
      doc.addPage();
      doc.fontSize(18).text("Job Match Results", { align: "center" });
      doc.moveDown();

      jobMatches.forEach((match, index) => {
        doc
          .fontSize(16)
          .text(`Job Match #${index + 1}`, { underline: true });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Match Percentage: ${match.matchPercentage}%`);
        doc.moveDown(0.5);

        doc.fontSize(13).text("Missing Keywords:");
        if (match.missingKeywords && match.missingKeywords.length > 0) {
          doc.fontSize(12).text(match.missingKeywords.join(", "));
        } else {
          doc.fontSize(12).text("None");
        }
        doc.moveDown(0.5);

        doc.fontSize(13).text("Suggested Improvements:");
        doc
          .fontSize(12)
          .text(match.suggestedImprovements || "N/A", { align: "left" });
        doc.moveDown(1.5);
      });
    }

    doc.end();
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Error generating PDF report:", err);
    if (!res.headersSent) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  }
};

module.exports = {
  generatePdfReport,
};

