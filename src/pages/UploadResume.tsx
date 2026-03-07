import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileUpload } from "@/components/FileUpload";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, FileText, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function UploadResume() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
    setAnalyzing(true);
    // Simulate analysis - will be replaced with actual AI call
    setTimeout(() => {
      setAnalyzing(false);
      toast.success("Resume analyzed successfully!");
      navigate("/analysis");
    }, 2000);
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
                    onClick={handleAnalyze}
                    disabled={!file || analyzing}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                    {!analyzing && <ArrowRight className="h-4 w-4" />}
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
                    onClick={handleAnalyze}
                    disabled={!file || analyzing}
                    className="w-full gap-2"
                    size="lg"
                  >
                    {analyzing ? "Analyzing..." : "Analyze & Match"}
                    {!analyzing && <ArrowRight className="h-4 w-4" />}
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
