
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
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, DatabaseZap, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;


export default function LoginPage() {
  const [isReseeding, setIsReseeding] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const handleLogin = async (values: LoginFormValues) => {
    const user = await login(values.email, values.password);
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
  
  const isLoggingIn = form.formState.isSubmitting;

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12" />
          <h1 className="text-3xl font-bold text-center">ZapDosConnect</h1>
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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="name@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex gap-4 pt-2">
                  <Button type="submit" className="w-full" disabled={isLoggingIn}>
                    {isLoggingIn && <Loader2 className="animate-spin" />}
                    {isLoggingIn ? "Logging in..." : "Login"}
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/register">Register</Link>
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertTitle>Demo Credentials</AlertTitle>
          <AlertDescription>
            <div className="text-xs font-mono">
              <p>TPO: tpo@test.com / password</p>
              <p>HOD: hod@test.com / password</p>
              <p>Student: student-cs-1@test.com / password</p>
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
