import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Briefcase, FileText } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="container flex-1 py-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-8 font-display text-3xl font-bold">Profile</h1>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 font-display text-xl text-primary">JD</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="font-display">John Doe</CardTitle>
                  <CardDescription>john@example.com</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="name" defaultValue="John Doe" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" defaultValue="john@example.com" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Target Role</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="role" defaultValue="Software Engineer" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Technology" />
                  </div>
                </div>

                <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
              </form>

              <Separator className="my-8" />

              {/* Stats */}
              <div>
                <h3 className="mb-4 font-display text-lg font-semibold">Your Stats</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border border-border p-4 text-center">
                    <FileText className="mx-auto mb-2 h-5 w-5 text-primary" />
                    <p className="font-display text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Resumes Analyzed</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 text-center">
                    <Briefcase className="mx-auto mb-2 h-5 w-5 text-accent" />
                    <p className="font-display text-2xl font-bold">82</p>
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                  </div>
                  <div className="rounded-lg border border-border p-4 text-center">
                    <User className="mx-auto mb-2 h-5 w-5 text-chart-3" />
                    <p className="font-display text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Days Active</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
