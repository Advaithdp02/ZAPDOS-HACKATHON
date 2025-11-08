
"use client";

import { useState } from "react";
import { generateStudentEmailTemplate } from "@/ai/flows/generate-student-email-templates";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const emailPurposes = [
  "Post-Interview Thank You",
  "Application Follow-up",
  "Accepting a Job Offer",
  "Declining a Job Offer",
  "Informational Interview Request",
];

const emailFormSchema = z.object({
  purpose: z.string({ required_error: "Please select a purpose." }),
  companyName: z.string().min(1, "Company name is required."),
  role: z.string().min(1, "Role is required."),
  interviewerName: z.string().optional(),
  additionalDetails: z.string().optional(),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;


export default function StudentEmailGeneratorPage() {
  const { user } = useAuth();
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      purpose: "",
      companyName: "",
      role: "",
      interviewerName: "",
      additionalDetails: "",
    }
  });

  const handleSubmit = async (values: EmailFormValues) => {
    if (!user?.name) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not find your user information. Please log in again.",
      });
      return;
    }

    setLoading(true);
    setGeneratedEmail("");

    try {
      const response = await generateStudentEmailTemplate({
        ...values,
        studentName: user.name,
        interviewerName: values.interviewerName || undefined,
      });
      setGeneratedEmail(response.emailTemplate);
    } catch (error) {
      console.error("Error generating email:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate the email template. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedEmail);
    toast({
        title: "Copied to Clipboard",
        description: "The email template has been copied."
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Email Generator"
        description="Create professional email templates for any stage of your job application."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Details</CardTitle>
                  <CardDescription>
                    Provide the details to generate the email.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="purpose"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Purpose</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a purpose" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emailPurposes.map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Software Engineer Intern" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="interviewerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interviewer Name (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="additionalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Details (Optional)</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Mention a specific project we discussed." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Button type="submit" className="w-full" disabled={loading || !form.formState.isValid}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? "Generating..." : "Generate Email"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="md:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Generated Email</CardTitle>
                    <CardDescription>
                        The AI-generated email will appear below.
                    </CardDescription>
                </div>
                {generatedEmail && <Button variant="outline" size="icon" onClick={handleCopy}><Copy className="h-4 w-4"/></Button>}
            </CardHeader>
            <CardContent>
                {loading && (
                    <div className="flex items-center justify-center h-96">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                {generatedEmail && (
                    <Textarea
                        value={generatedEmail}
                        readOnly
                        className="h-[500px] text-sm font-mono bg-background whitespace-pre-wrap"
                    />
                )}
                {!loading && !generatedEmail && (
                    <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground">Generated email will be displayed here.</p>
                    </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
