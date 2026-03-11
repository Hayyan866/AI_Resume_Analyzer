const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const OpenAI = require("openai");

// ─────────────────────────────────────────────────────────
// STEP 1: Extract text from PDF or DOCX file
// ─────────────────────────────────────────────────────────
const extractResumeText = async (filePath, mimeType) => {
    const buffer = fs.readFileSync(filePath);

    if (mimeType === "application/pdf") {
        // Use pdf-parse to extract text from PDF
        const data = await pdfParse(buffer);
        return data.text;
    }

    if (
        mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
        // Use mammoth to extract raw text from DOCX
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    }

    throw new Error("Unsupported file type");
};

// ─────────────────────────────────────────────────────────
// STEP 2: Keyword-based validation
// Checks if the document contains at least 2 common resume section keywords
// ─────────────────────────────────────────────────────────
const RESUME_KEYWORDS = [
    "education",
    "experience",
    "skills",
    "projects",
    "certifications",
    "work experience",
    "technical skills",
    "summary",
    "contact",
    "objective",
    "employment",
    "qualifications",
];

const isResume = (text) => {
    if (!text || typeof text !== "string") return false;

    const lowerText = text.toLowerCase();

    // Count how many resume keywords are found in the text
    const matchCount = RESUME_KEYWORDS.filter((keyword) =>
        lowerText.includes(keyword)
    ).length;

    // Require at least 2 matches to classify as a resume
    return matchCount >= 2;
};

// ─────────────────────────────────────────────────────────
// STEP 3 (Optional): AI-based validation via OpenAI
// Sends extracted text to GPT and asks: is this a resume?
// Returns true if YES, false if NO or API unavailable
// ─────────────────────────────────────────────────────────
const isResumeByAI = async (text) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        // Skip AI validation if no key is configured
        return null;
    }

    try {
        const openai = new OpenAI({ apiKey });

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a document classifier. Your only job is to determine if a document is a professional resume. Respond only with YES or NO.",
                },
                {
                    role: "user",
                    content: `Determine whether the following document is a professional resume.\nRespond only with YES or NO.\n\n${text.slice(0, 4000)}`,
                },
            ],
            temperature: 0,
            max_tokens: 3,
        });

        const answer = response.choices[0]?.message?.content?.trim().toUpperCase();
        return answer === "YES";
    } catch (err) {
        // If AI validation fails (e.g., quotas), fall through to keyword validation
        console.warn("AI resume validation skipped due to error:", err.message);
        return null;
    }
};

// ─────────────────────────────────────────────────────────
// STEP 4: Full validation pipeline
// Combines keyword check + optional AI check
// Returns { valid: boolean, reason: string }
// ─────────────────────────────────────────────────────────
const validateResume = async (text) => {
    // First run keyword validation (fast, no API needed)
    const keywordResult = isResume(text);

    if (!keywordResult) {
        // Fail fast if even keyword check fails
        return {
            valid: false,
            reason: "Document does not appear to contain standard resume sections.",
        };
    }

    // Optionally run AI validation for a more accurate check
    const aiResult = await isResumeByAI(text);

    if (aiResult === false) {
        // AI explicitly said NO
        return {
            valid: false,
            reason: "AI classification determined this is not a resume.",
        };
    }

    // Passed keyword check (and AI check if available)
    return { valid: true, reason: "Document validated as a resume." };
};

module.exports = {
    extractResumeText,
    isResume,
    isResumeByAI,
    validateResume,
};
