import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/Footer";
import { FileText, Zap, Target, BarChart3, Shield, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

const features = [
  { icon: Zap, title: "AI-Powered Analysis", desc: "Get instant, detailed feedback on your resume using advanced AI models." },
  { icon: Target, title: "ATS Optimization", desc: "Ensure your resume passes Applicant Tracking Systems with high scores." },
  { icon: BarChart3, title: "Job Match Scoring", desc: "Compare your resume against job descriptions for a match percentage." },
  { icon: Shield, title: "Keyword Analysis", desc: "Identify missing keywords and optimize for industry relevance." },
];

const steps = [
  { num: "01", title: "Upload Resume", desc: "Upload your PDF or DOCX resume in seconds." },
  { num: "02", title: "AI Analyzes", desc: "Our AI evaluates formatting, keywords, ATS compatibility, and more." },
  { num: "03", title: "Get Report", desc: "Receive a comprehensive report with scores and actionable suggestions." },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            ResumeAI
          </Link>
          <div className="flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/login">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            ) : (
              <Link to="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
              <Zap className="h-3.5 w-3.5" /> AI-Powered Resume Analysis
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              Land Your Dream Job with{" "}
              <span className="text-primary">AI Resume Analysis</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground md:text-xl">
              Upload your resume and get instant ATS scoring, keyword analysis, job match percentage, and actionable improvement suggestions.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link to={user ? "/upload" : "/login"}>
                <Button size="lg" className="gap-2 text-base">
                  Analyze My Resume <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={user ? "/dashboard" : "/login"}>
                <Button variant="outline" size="lg" className="text-base">
                  View Demo Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">Everything You Need to Optimize Your Resume</h2>
            <p className="mt-3 text-muted-foreground">Comprehensive analysis powered by cutting-edge AI technology.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div key={f.title} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                <Card className="h-full border-border/50 transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">How It Works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps to a better resume.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div key={s.num} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 font-display text-xl font-bold text-primary">
                  {s.num}
                </div>
                <h3 className="font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary/5 py-20">
        <div className="container text-center">
          <h2 className="font-display text-3xl font-bold">Ready to Improve Your Resume?</h2>
          <p className="mt-3 text-muted-foreground">Join thousands of job seekers who landed interviews with our AI analysis.</p>
          <Link to={user ? "/upload" : "/login"}>
            <Button size="lg" className="mt-8 gap-2 text-base">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
