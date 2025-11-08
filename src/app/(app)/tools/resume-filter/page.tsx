
"use client";

import { useState } from "react";
import { filterResumes, FilterResumesOutput } from "@/ai/flows/filter-resumes-with-ai";
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
import { FileUpload } from "@/components/file-upload";
import { Loader2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const resumeFilterSchema = z.object({
  resumeFile: z.instanceof(File, { message: "A resume file is required." }),
  jobDescription: z.string().min(1, "Job description is required."),
});

type ResumeFilterFormValues = z.infer<typeof resumeFilterSchema>;

export default function ResumeFilterPage() {
  const [result, setResult] = useState<FilterResumesOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ResumeFilterFormValues>({
    resolver: zodResolver(resumeFilterSchema),
  });

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (values: ResumeFilterFormValues) => {
    setLoading(true);
    setResult(null);

    try {
      const resumeDataUri = await fileToDataUri(values.resumeFile);
      const response = await filterResumes({ resumeDataUri, jobDescription: values.jobDescription });
      setResult(response);
    } catch (error) {
      console.error("Error filtering resume:", error);
      toast({
        variant: "destructive",
        title: "AI Analysis Failed",
        description: "Could not process the resume. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Resume Filter"
        description="Automatically extract candidate information and analyze job fit."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inputs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="resumeFile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>1. Upload Resume</FormLabel>
                        <FormControl>
                          <FileUpload onFileSelect={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="jobDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>2. Job Description</FormLabel>
                        <FormControl>
                           <Textarea
                            placeholder="Paste the job description here..."
                            rows={10}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Analyzing..." : "Analyze Resume"}
              </Button>
            </form>
          </Form>
        </div>
        <div className="md:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle>Analysis Result</CardTitle>
              <CardDescription>
                The extracted information and job fit analysis will appear here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {result && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Job Fit Analysis</h3>
                    <p className="text-sm text-muted-foreground">{result.candidateInfo.jobFitAnalysis}</p>
                  </div>
                  <Separator />
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2">Skills</h3>
                      <p className="text-sm">{result.candidateInfo.skills}</p>
                    </div>
                     <div>
                      <h3 className="font-semibold mb-2">Experience</h3>
                      <p className="text-sm">{result.candidateInfo.experience}</p>
                    </div>
                     <div>
                      <h3 className="font-semibold mb-2">Education</h3>
                      <p className="text-sm">{result.candidateInfo.education}</p>
                    </div>
                  </div>
                  <Separator />
                   <div>
                    <h3 className="font-semibold mb-2">Formatted Resume</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-muted/20 whitespace-pre-wrap font-mono text-xs">
                        {result.formattedResume}
                    </div>
                  </div>
                </div>
              )}
              {!loading && !result && (
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Results will be displayed here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
