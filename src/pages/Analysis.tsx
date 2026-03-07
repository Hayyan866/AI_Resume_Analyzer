import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreCard } from "@/components/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Target, Zap, BarChart3, Download, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";

interface AnalysisData {
  resumeScore: number;
  atsScore: number;
  keywordScore: number;
  jobMatchScore: number;
  sections: { name: string; score: number; status: "strong" | "average" | "weak" }[];
  presentKeywords: string[];
  missingKeywords: string[];
  skills: { skill: string; level: number }[];
  suggestions: { type: string; text: string }[];
}

// Fallback demo data
const demoData: AnalysisData = {
  resumeScore: 82, atsScore: 78, keywordScore: 85, jobMatchScore: 71,
  sections: [
    { name: "Contact Information", score: 95, status: "strong" },
    { name: "Work Experience", score: 82, status: "strong" },
    { name: "Education", score: 78, status: "average" },
    { name: "Skills", score: 88, status: "strong" },
    { name: "Projects", score: 60, status: "average" },
    { name: "Certifications", score: 45, status: "weak" },
  ],
  presentKeywords: ["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Git", "REST API"],
  missingKeywords: ["Machine Learning", "Docker", "CI/CD", "AWS", "GraphQL"],
  skills: [],
  suggestions: [
    { type: "improvement", text: "Add measurable achievements with specific numbers." },
    { type: "improvement", text: "Use stronger action verbs at the beginning of bullet points." },
    { type: "warning", text: "Certifications section is weak — consider adding relevant certifications." },
    { type: "improvement", text: "Add a professional summary section." },
  ],
};

export default function Analysis() {
  const [data, setData] = useState<AnalysisData>(demoData);
  const [fileName, setFileName] = useState("Demo Resume");

  useEffect(() => {
    const stored = sessionStorage.getItem("resumeAnalysis");
    const storedName = sessionStorage.getItem("resumeFileName");
    if (stored) {
      try {
        setData(JSON.parse(stored));
        if (storedName) setFileName(storedName);
      } catch {}
    }
  }, []);

  const statusIcon = {
    strong: <CheckCircle2 className="h-4 w-4 text-primary" />,
    average: <AlertTriangle className="h-4 w-4 text-chart-3" />,
    weak: <XCircle className="h-4 w-4 text-destructive" />,
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Analysis Report</h1>
            <p className="text-muted-foreground">{fileName}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/upload">
              <Button variant="outline" className="gap-2">
                <FileText className="h-4 w-4" /> New Analysis
              </Button>
            </Link>
            <Button className="gap-2">
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard title="Resume Score" score={data.resumeScore} icon={FileText} />
          <ScoreCard title="ATS Score" score={data.atsScore} icon={Target} />
          <ScoreCard title="Keyword Score" score={data.keywordScore} icon={Zap} />
          <ScoreCard title="Job Match" score={data.jobMatchScore} icon={BarChart3} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Section Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.sections.map((s) => (
                <div key={s.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {statusIcon[s.status]}
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <span className="font-display text-sm font-bold">{s.score}%</span>
                  </div>
                  <Progress value={s.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Present Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {data.presentKeywords.map((k) => (
                    <Badge key={k} variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> {k}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {data.missingKeywords.map((k) => (
                    <Badge key={k} variant="secondary" className="border-destructive/20 bg-destructive/10 text-destructive">
                      <XCircle className="mr-1 h-3 w-3" /> {k}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-chart-3" /> AI Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    {s.type === "warning" || s.type === "critical" ? (
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-chart-3" />
                    ) : (
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    )}
                    <p className="text-sm">{s.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
