
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

const defaultEmailStages = [
  "Application Received",
  "Interview Scheduled",
  "Offer Released",
  "Rejection Email",
];

export type EmailGeneratorProps = {
    stage: string;
    stages?: string[];
    companyName: string;
    role: string;
    studentName: string;
    additionalDetails?: string;
    onEmailSent?: () => void;
};

export function EmailGenerator(props: EmailGeneratorProps) {
  const [stage, setStage] = useState(props.stage);
  const [companyName, setCompanyName] = useState(props.companyName);
  const [role, setRole] = useState(props.role);
  const [studentName, setStudentName] = useState(props.studentName);
  const [additionalDetails, setAdditionalDetails] = useState(props.additionalDetails || "");
  const [emailStages, setEmailStages] = useState(props.stages || defaultEmailStages);


  const [generatedEmail, setGeneratedEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // If key props change, it indicates a new context (e.g. new student selected)
    setStage(props.stage);
    setCompanyName(props.companyName);
    setRole(props.role);
    setStudentName(props.studentName);
    setEmailStages(props.stages || defaultEmailStages);
    if (!props.stages?.includes("Rejection Email")) {
      setEmailStages(prev => [...prev, "Rejection Email"]);
    }
    setGeneratedEmail(""); // Clear previous email
  }, [props.stage, props.companyName, props.role, props.studentName, props.stages]);


  const handleGeneration = async () => {
    if (!stage || !companyName || !role || !studentName) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    if (generatedEmail) {
      setGeneratedEmail("");
    }

    try {
      const response = await generateEmailTemplate({
        stage,
        companyName,
        role,
        studentName,
        additionalDetails,
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
    if (props.onEmailSent) {
        props.onEmailSent();
    }
  }

  return (
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Details</CardTitle>
                <CardDescription>
                  Provide the details to generate the email.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select onValueChange={setStage} value={stage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {emailStages.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-name">Student Name</Label>
                  <Input
                    id="student-name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additional-details">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    id="additional-details"
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
            {!generatedEmail ? (
                <Button onClick={handleGeneration} className="w-full" disabled={loading}>
                {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                {loading ? "Generating..." : "Generate Email"}
                </Button>
            ) : (
                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={handleGeneration} className="w-full" disabled={loading}>
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
          </div>
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
