import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText, jobDescription, analysisType } = await req.json();

    if (!resumeText || typeof resumeText !== "string" || resumeText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Resume text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert resume analyst and ATS optimization specialist. Analyze the provided resume text and return structured JSON output using the provided tool.

Evaluation criteria:
- ATS Compatibility: formatting, standard section headings, parsability
- Keyword Optimization: industry-relevant keywords, action verbs, technical terms
- Readability: clear structure, bullet points, concise language
- Formatting: consistent dates, proper sections, professional layout
- Skill Relevance: alignment with target role/industry
- Measurable Achievements: quantified results, specific metrics

${jobDescription ? `Also compare the resume against this job description and calculate a match score:\n${jobDescription}` : ""}`;

    const userPrompt = `Analyze this resume:\n\n${resumeText.substring(0, 8000)}`;

    const toolSchema = {
      type: "function" as const,
      function: {
        name: "submit_analysis",
        description: "Submit the complete resume analysis results",
        parameters: {
          type: "object",
          properties: {
            resumeScore: { type: "number", description: "Overall resume score 0-100" },
            atsScore: { type: "number", description: "ATS compatibility score 0-100" },
            keywordScore: { type: "number", description: "Keyword optimization score 0-100" },
            jobMatchScore: { type: "number", description: "Job description match score 0-100 (0 if no job description)" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  score: { type: "number" },
                  status: { type: "string", enum: ["strong", "average", "weak"] },
                },
                required: ["name", "score", "status"],
                additionalProperties: false,
              },
            },
            presentKeywords: {
              type: "array",
              items: { type: "string" },
              description: "Keywords found in the resume",
            },
            missingKeywords: {
              type: "array",
              items: { type: "string" },
              description: "Important keywords missing from the resume",
            },
            skills: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  skill: { type: "string" },
                  level: { type: "number", description: "Proficiency 0-100 based on resume context" },
                },
                required: ["skill", "level"],
                additionalProperties: false,
              },
            },
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string", enum: ["improvement", "warning", "critical"] },
                  text: { type: "string" },
                },
                required: ["type", "text"],
                additionalProperties: false,
              },
            },
          },
          required: [
            "resumeScore", "atsScore", "keywordScore", "jobMatchScore",
            "sections", "presentKeywords", "missingKeywords", "skills", "suggestions",
          ],
          additionalProperties: false,
        },
      },
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [toolSchema],
        tool_choice: { type: "function", function: { name: "submit_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("No analysis result returned from AI");
    }

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-resume error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
