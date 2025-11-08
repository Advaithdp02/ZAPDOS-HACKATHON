
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, DatabaseZap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isReseeding, setIsReseeding] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await login(email, password);
    if (user) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.name}!`,
      });
      router.push("/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
      });
    }
  };

  const handleReseedDatabase = async () => {
    setIsReseeding(true);
    toast({
      title: "Resetting Database...",
      description: "This may take a moment. Please wait.",
    });
    try {
      const response = await fetch('/api/reseed', { method: 'POST' });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset database');
      }
      toast({
        title: "Database Reset Successfully",
        description: "The database has been cleared and re-seeded with test data.",
      });
      // Clear session storage to force re-login with new user IDs
      sessionStorage.clear();
      // Optionally, reload the page to get a clean state
      window.location.reload();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        variant: "destructive",
        title: "Database Reset Failed",
        description: errorMessage,
      });
    } finally {
      setIsReseeding(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-center">CampusConnect</h1>
          <p className="text-muted-foreground text-center">
            Your bridge between college and career.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Demo Credentials</AlertTitle>
          <AlertDescription>
            <div className="text-xs font-mono">
              <p>TPO: tpo@test.com / password</p>
              <p>HOD: hod@test.com / password</p>
              <p>Student: student@test.com / password</p>
            </div>
          </AlertDescription>
        </Alert>
      </div>

       <div className="absolute bottom-4 right-4">
        <Button variant="destructive" onClick={handleReseedDatabase} disabled={isReseeding}>
          {isReseeding ? <Loader2 className="animate-spin"/> : <DatabaseZap />}
          {isReseeding ? "Resetting..." : "Reset Database"}
        </Button>
      </div>
    </main>
  );
}
