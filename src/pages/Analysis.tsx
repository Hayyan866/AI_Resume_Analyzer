import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreCard } from "@/components/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FileText, Target, Zap, BarChart3, Download, CheckCircle2, AlertTriangle, XCircle, Lightbulb } from "lucide-react";

// Demo analysis data
const sections = [
  { name: "Contact Information", score: 95, status: "strong" as const },
  { name: "Work Experience", score: 82, status: "strong" as const },
  { name: "Education", score: 78, status: "average" as const },
  { name: "Skills", score: 88, status: "strong" as const },
  { name: "Projects", score: 60, status: "average" as const },
  { name: "Certifications", score: 45, status: "weak" as const },
];

const missingKeywords = ["Machine Learning", "Docker", "CI/CD", "AWS", "GraphQL"];
const presentKeywords = ["JavaScript", "React", "Node.js", "TypeScript", "SQL", "Git", "REST API", "Agile"];

const suggestions = [
  { type: "improvement", text: "Add measurable achievements with specific numbers (e.g., 'Increased revenue by 25%')." },
  { type: "improvement", text: "Use stronger action verbs at the beginning of bullet points." },
  { type: "warning", text: "Certifications section is weak — consider adding relevant certifications." },
  { type: "improvement", text: "Add a professional summary section highlighting 3-5 key strengths." },
  { type: "warning", text: "Projects section could include more technical details and outcomes." },
  { type: "improvement", text: "Ensure consistent date formatting throughout the resume." },
];

const statusConfig = {
  strong: { color: "bg-primary/10 text-primary", icon: CheckCircle2 },
  average: { color: "bg-chart-3/10 text-chart-3", icon: AlertTriangle },
  weak: { color: "bg-destructive/10 text-destructive", icon: XCircle },
};

export default function Analysis() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Analysis Report</h1>
            <p className="text-muted-foreground">Software_Engineer_Resume.pdf</p>
          </div>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Export PDF Report
          </Button>
        </div>

        {/* Score Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard title="Resume Score" score={82} icon={FileText} />
          <ScoreCard title="ATS Score" score={78} icon={Target} />
          <ScoreCard title="Keyword Score" score={85} icon={Zap} />
          <ScoreCard title="Job Match" score={71} icon={BarChart3} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Section Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Section Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {sections.map((s) => {
                const cfg = statusConfig[s.status];
                const StatusIcon = cfg.icon;
                return (
                  <div key={s.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`h-4 w-4 ${s.status === "strong" ? "text-primary" : s.status === "average" ? "text-chart-3" : "text-destructive"}`} />
                        <span className="text-sm font-medium">{s.name}</span>
                      </div>
                      <span className="font-display text-sm font-bold">{s.score}%</span>
                    </div>
                    <Progress value={s.score} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Keywords */}
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Keyword Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Present Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {presentKeywords.map((k) => (
                    <Badge key={k} variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" /> {k}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm font-medium text-muted-foreground">Missing Keywords</p>
                <div className="flex flex-wrap gap-2">
                  {missingKeywords.map((k) => (
                    <Badge key={k} variant="secondary" className="border-destructive/20 bg-destructive/10 text-destructive">
                      <XCircle className="mr-1 h-3 w-3" /> {k}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2 text-lg">
                <Lightbulb className="h-5 w-5 text-chart-3" /> AI Improvement Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border p-4">
                    {s.type === "warning" ? (
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
