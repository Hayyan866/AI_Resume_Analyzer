import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScoreCard } from "@/components/ScoreCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, Zap, BarChart3, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// Demo data
const skillsData = [
  { skill: "JavaScript", level: 90 },
  { skill: "React", level: 85 },
  { skill: "Node.js", level: 70 },
  { skill: "Python", level: 65 },
  { skill: "SQL", level: 75 },
  { skill: "TypeScript", level: 80 },
];

const keywordData = [
  { keyword: "Leadership", count: 4 },
  { keyword: "Agile", count: 3 },
  { keyword: "Teamwork", count: 5 },
  { keyword: "Problem-solving", count: 2 },
  { keyword: "Communication", count: 6 },
];

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

const resumeHistory = [
  { id: "1", name: "Software_Engineer_Resume.pdf", date: "2024-12-15", score: 82 },
  { id: "2", name: "Frontend_Dev_Resume.pdf", date: "2024-12-10", score: 74 },
  { id: "3", name: "FullStack_Resume.docx", date: "2024-11-28", score: 91 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Your resume analytics at a glance.</p>
          </div>
          <Link to="/upload">
            <Button className="gap-2">
              <FileText className="h-4 w-4" /> Upload New Resume
            </Button>
          </Link>
        </div>

        {/* Score Cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ScoreCard title="Resume Score" score={82} icon={FileText} description="Overall quality" />
          <ScoreCard title="ATS Score" score={78} icon={Target} description="ATS compatibility" />
          <ScoreCard title="Keyword Score" score={85} icon={Zap} description="Keyword optimization" />
          <ScoreCard title="Job Match" score={71} icon={BarChart3} description="vs. target role" />
        </div>

        {/* Charts */}
        <div className="mb-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Skills Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="skill" className="text-xs" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Level" dataKey="level" stroke="hsl(168, 80%, 36%)" fill="hsl(168, 80%, 36%)" fillOpacity={0.2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Keyword Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={keywordData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="keyword" className="text-xs" />
                  <YAxis />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Bar dataKey="count" fill="hsl(252, 80%, 60%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
            <div className="space-y-3">
              {resumeHistory.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">{r.name}</p>
                      <p className="text-sm text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-primary">{r.score}/100</span>
                    <Link to="/analysis">
                      <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    </Link>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
