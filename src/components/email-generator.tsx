
"use client";

import { useState, useEffect } from "react";
import { generateEmailTemplate } from "@/ai/flows/generate-email-templates";
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
import { Copy, Loader2, Sparkles, Send } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";


const emailGeneratorSchema = z.object({
  stage: z.string().min(1, "Stage is required."),
  companyName: z.string().min(1, "Company name is required."),
  role: z.string().min(1, "Role is required."),
  studentName: z.string().min(1, "Student name is required."),
  additionalDetails: z.string().optional(),
});

type EmailGeneratorFormValues = z.infer<typeof emailGeneratorSchema>;

const defaultEmailStages = [
  "Application Received",
  "Interview Scheduled",
  "Offer Released",
  "Rejection Email",
];

export type EmailGeneratorProps = {
    applicationId: string;
    stage: string;
    stages?: string[];
    companyName: string;
    role: string;
    studentName: string;
    additionalDetails?: string;
    onEmailSent: (applicationId: string, stage: string) => void;
};

export function EmailGenerator(props: EmailGeneratorProps) {
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EmailGeneratorFormValues>({
    resolver: zodResolver(emailGeneratorSchema),
    defaultValues: {
        stage: props.stage || "",
        companyName: props.companyName || "",
        role: props.role || "",
        studentName: props.studentName || "",
        additionalDetails: props.additionalDetails || "",
    }
  });

  const emailStages = props.stages && props.stages.length > 0 ? [...props.stages, "Rejection Email"] : defaultEmailStages;

  useEffect(() => {
    // If key props change, it indicates a new context (e.g. new student selected)
    form.reset({
        stage: props.stage,
        companyName: props.companyName,
        role: props.role,
        studentName: props.studentName,
        additionalDetails: props.additionalDetails || "",
    });
    setGeneratedEmail(""); // Clear previous email
  }, [props.stage, props.companyName, props.role, props.studentName, props.additionalDetails, form]);


  const handleGeneration = async (values: EmailGeneratorFormValues) => {
    setLoading(true);
    if (generatedEmail) {
      setGeneratedEmail("");
    }

    try {
      const response = await generateEmailTemplate(values);
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

  const getMailtoLink = () => {
    if (!generatedEmail) return "";
    const subjectMatch = generatedEmail.match(/Subject: (.*)/);
    const subject = subjectMatch ? subjectMatch[1] : "Email from CampusConnect";
    
    // Find the start of the body after the subject line (and potential newlines)
    const bodyStartIndex = subjectMatch ? generatedEmail.indexOf(subjectMatch[0]) + subjectMatch[0].length : 0;
    const body = generatedEmail.substring(bodyStartIndex).trim();

    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const handleSendEmail = () => {
    const mailtoLink = getMailtoLink();
    if (mailtoLink) {
        window.open(mailtoLink, '_blank');
    }
    
    props.onEmailSent(props.applicationId, form.getValues('stage'));
  }

  return (
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
         <Form {...form}>
          <form onSubmit={form.handleSubmit(handleGeneration)} className="space-y-6">
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
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Stage</Label>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emailStages.map((s) => (
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
                    name="studentName"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Student Name</Label>
                        <FormControl><Input {...field} readOnly /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                 <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Company Name</Label>
                        <FormControl><Input {...field} readOnly /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Role</Label>
                        <FormControl><Input {...field} readOnly /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                <FormField
                    control={form.control}
                    name="additionalDetails"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Additional Details (Optional)</Label>
                        <FormControl><Textarea {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </CardContent>
            </Card>
            {!generatedEmail ? (
                <Button type="submit" className="w-full" disabled={loading || !form.formState.isValid}>
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? "Generating..." : "Generate Email"}
                </Button>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <Button type="submit" variant="outline" className="w-full" disabled={loading || !form.formState.isValid}>
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        {loading ? "Regenerating..." : "Regenerate"}
                    </Button>
                    <Button onClick={handleSendEmail} className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send & Update
                    </Button>
                </div>
            )}
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
                        className="h-[500px] text-sm font-mono bg-background"
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
  );
}
