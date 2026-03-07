import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileUpload } from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FileText, Briefcase, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Simple text extraction from file (reads as text for demo; real parsing needs backend)
async function extractText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async (withJobMatch = false) => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
    setAnalyzing(true);
    try {
      const resumeText = await extractText(file);

      if (resumeText.trim().length < 50) {
        toast.error("Could not extract enough text from the file. Please try a different file.");
        setAnalyzing(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: {
          resumeText,
          jobDescription: withJobMatch ? jobDescription : undefined,
          analysisType: withJobMatch ? "job-match" : "general",
        },
      });

      if (error) {
        throw new Error(error.message || "Analysis failed");
      }

      // Store analysis in sessionStorage for the report page
      sessionStorage.setItem("resumeAnalysis", JSON.stringify(data));
      sessionStorage.setItem("resumeFileName", file.name);

      toast.success("Resume analyzed successfully!");
      navigate("/analysis");
    } catch (err: any) {
      console.error("Analysis error:", err);
      if (err.message?.includes("Rate limit")) {
        toast.error("Rate limit exceeded. Please wait a moment and try again.");
      } else if (err.message?.includes("credits")) {
        toast.error("AI credits exhausted. Please add credits to continue.");
      } else {
        toast.error(err.message || "Analysis failed. Please try again.");
      }
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="font-display text-3xl font-bold">Upload Your Resume</h1>
            <p className="mt-2 text-muted-foreground">
              Upload your resume and optionally paste a job description for matching.
            </p>
          </div>

          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="gap-2">
                <FileText className="h-4 w-4" /> Resume Upload
              </TabsTrigger>
              <TabsTrigger value="job-match" className="gap-2">
                <Briefcase className="h-4 w-4" /> Job Match
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Upload Resume</CardTitle>
                  <CardDescription>Supported formats: PDF, DOCX (max 10MB)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload onFileSelect={setFile} />
                  <Button
                    onClick={() => handleAnalyze(false)}
                    disabled={!file || analyzing}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {analyzing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <>Analyze Resume <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="job-match">
              <Card>
                <CardHeader>
                  <CardTitle className="font-display">Job Description Match</CardTitle>
                  <CardDescription>Upload your resume and paste a job description to compare.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FileUpload onFileSelect={setFile} />
                  <div className="space-y-2">
                    <Label htmlFor="job-desc">Job Description</Label>
                    <Textarea
                      id="job-desc"
                      placeholder="Paste the job description here..."
                      rows={8}
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={() => handleAnalyze(true)}
                    disabled={!file || analyzing}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {analyzing ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</>
                    ) : (
                      <>Analyze & Match <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
