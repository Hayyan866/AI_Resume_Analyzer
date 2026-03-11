const OpenAI = require("openai");

let client;

const getClient = () => {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
};

const parseJsonSafe = (content) => {
  try {
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
};

const analyzeResumeWithAI = async (resumeText) => {
  const openai = getClient();

  const prompt = `
You are an expert ATS and resume evaluator. Analyze the following resume text and respond ONLY with a strict JSON object that matches this TypeScript type:

type ResumeAnalysis = {
  resumeScore: number; // from 0 to 100
  atsCompatibility: string;
  keywordOptimization: string;
  skillRelevance: string;
  formattingReadability: string;
  improvementSuggestions: string;
};

Resume text:
"""${resumeText.slice(0, 12000)}"""
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a strict JSON API. Always respond with valid minified JSON and nothing else.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0]?.message?.content || "";
  const parsed = parseJsonSafe(content);

  if (!parsed || typeof parsed.resumeScore !== "number") {
    throw new Error("Failed to parse AI resume analysis response");
  }

  return {
    ...parsed,
    rawResponse: content,
  };
};

const analyzeJobMatchWithAI = async (resumeText, jobDescription) => {
  const openai = getClient();

  const prompt = `
You are an expert hiring manager and ATS system. Compare the following resume and job description and respond ONLY with a strict JSON object that matches this TypeScript type:

type JobMatch = {
  matchPercentage: number; // 0-100
  missingKeywords: string[];
  suggestedImprovements: string;
};

Resume:
"""${resumeText.slice(0, 8000)}"""

Job Description:
"""${jobDescription.slice(0, 8000)}"""
`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a strict JSON API. Always respond with valid minified JSON and nothing else.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.2,
  });

  const content = completion.choices[0]?.message?.content || "";
  const parsed = parseJsonSafe(content);

  if (!parsed || typeof parsed.matchPercentage !== "number") {
    throw new Error("Failed to parse AI job match response");
  }

  return {
    matchPercentage: parsed.matchPercentage,
    missingKeywords: Array.isArray(parsed.missingKeywords)
      ? parsed.missingKeywords
      : [],
    suggestedImprovements: parsed.suggestedImprovements || "",
  };
};

module.exports = {
  analyzeResumeWithAI,
  analyzeJobMatchWithAI,
};

