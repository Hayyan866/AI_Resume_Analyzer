import { FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card py-8">
      <div className="container flex flex-col items-center gap-4 text-center text-sm text-muted-foreground md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-2 font-display font-semibold text-foreground">
          <FileText className="h-4 w-4 text-primary" />
          ResumeAI
        </div>
        <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. All rights reserved.</p>
      </div>
    </footer>
  );
}
