import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreCard } from "@/components/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, Zap, BarChart3, Trash2, Eye, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const sectionData = [
  { section: "Contact", strength: 95 },
  { section: "Experience", strength: 82 },
  { section: "Education", strength: 78 },
  { section: "Skills", strength: 88 },
  { section: "Projects", strength: 60 },
  { section: "Certifications", strength: 45 },
];

const pieData = [
  { name: "Strong", value: 65 },
  { name: "Average", value: 25 },
  { name: "Weak", value: 10 },
];

const PIE_COLORS = [
  "hsl(168, 80%, 36%)",
  "hsl(36, 95%, 55%)",
  "hsl(0, 72%, 51%)",
];

interface ResumeHistoryItem {
  _id: string;
  fileName: string;
  createdAt: string;
  analysisResult?: {
    resumeAnalysis?: {
      resumeScore?: number;
    };
  };
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export default function Dashboard() {
  const { user, session } = useAuth();
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // Fetch resume history for the logged-in user
  useEffect(() => {
    if (!session?.token) {
      setHistoryLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/resume/history`, {
          headers: { Authorization: `Bearer ${session.token}` },
        });
        if (!res.ok) throw new Error("Failed to load history");
        const data = await res.json();
        setHistory(data.resumes || []);
      } catch (err) {
        console.error("Error fetching resume history:", err);
        toast.error("Could not load resume history.");
      } finally {
        setHistoryLoading(false);
      }
    };

    fetchHistory();
  }, [session?.token]);

  const handleDelete = async (id: string) => {
    if (!session?.token) return;
    try {
      const res = await fetch(`${API_URL}/api/resume/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setHistory((prev) => prev.filter((r) => r._id !== id));
      toast.success("Resume deleted.");
    } catch {
      toast.error("Failed to delete resume.");
    }
  };

  // Derive avg score from history
  const avgScore = history.length
    ? Math.round(
      history.reduce(
        (sum, r) => sum + (r.analysisResult?.resumeAnalysis?.resumeScore ?? 0),
        0
      ) / history.length
    )
    : 0;

  // Build skills chart from most recent resume (or fallback empty)
  const latestAnalysis = history[0]?.analysisResult?.resumeAnalysis;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${user.name}!` : "Your resume analytics at a glance."}
            </p>
          </div>
          <Link to="/upload">
            <Button className="gap-2">
              <FileText className="h-4 w-4" /> Upload New Resume
            </Button>
          </Link>
        </div>

        {/* Score Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard title="Resumes Analyzed" score={history.length} icon={FileText} description="Total uploads" />
          <ScoreCard title="Avg. Score" score={avgScore} icon={Target} description="Across all resumes" />
          <ScoreCard title="Latest Score" score={history[0]?.analysisResult?.resumeAnalysis?.resumeScore ?? 0} icon={Zap} description="Most recent analysis" />
          <ScoreCard title="Job Matches" score={0} icon={BarChart3} description="vs. target role" />
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Section Strength</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis type="category" dataKey="section" width={100} className="text-xs" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="strength" fill="hsl(168, 80%, 36%)" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Overall Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Resume History */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-lg">Resume History</CardTitle>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center justify-center py-10 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading your resumes...</span>
              </div>
            ) : history.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                <FileText className="mx-auto mb-3 h-10 w-10 opacity-30" />
                <p>No resumes uploaded yet.</p>
                <Link to="/upload">
                  <Button variant="outline" className="mt-4">Upload Your First Resume</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((r) => {
                  const score = r.analysisResult?.resumeAnalysis?.resumeScore;
                  const date = new Date(r.createdAt).toLocaleDateString();
                  return (
                    <div
                      key={r._id}
                      className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{r.fileName}</p>
                          <p className="text-sm text-muted-foreground">{date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-display font-bold text-primary">
                          {score != null ? `${score}/100` : "Not analyzed"}
                        </span>
                        <Link to="/analysis">
                          <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(r._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
