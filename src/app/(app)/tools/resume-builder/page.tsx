
"use client";

import { useState, useTransition } from "react";
import { formatResume } from "@/ai/flows/format-resume";
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
import { Loader2, Sparkles, Download, Info, Save } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import * as api from "@/lib/api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import type { ResumeItem } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const resumeBuilderSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Please enter a valid email."),
    phone: z.string().optional(),
    education: z.string().min(1, "Education is required."),
    skills: z.string().min(1, "Skills are required."),
    experience: z.string().min(1, "Experience is required."),
    resumeStyle: z.enum(['ATS', 'Minimalist', 'Graphical']),
});

type ResumeBuilderFormValues = z.infer<typeof resumeBuilderSchema>;


export default function ResumeBuilderPage() {
  const { user } = useAuth();
  
  const [formattedResume, setFormattedResume] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const { toast } = useToast();

  const form = useForm<ResumeBuilderFormValues>({
    resolver: zodResolver(resumeBuilderSchema),
    defaultValues: {
        name: "",
        email: "",
        phone: "",
        education: "",
        skills: "",
        experience: "",
        resumeStyle: "ATS",
    }
  });

  useEffect(() => {
    if (user) {
      api.getStudentProfile(user.id).then(profile => {
        if (profile) {
            form.setValue("name", profile.name);
            form.setValue("email", profile.email);
            form.setValue("skills", profile.skills.join(', '));
            
            const educationString = profile.education.map(e => `${e.degree} at ${e.institution} (${e.startDate}-${e.endDate}) with ${e.grade}`).join('\n');
            form.setValue("education", educationString);

            const experienceString = profile.experience.map(e => `${e.role} at ${e.company} (${e.startDate}-${e.endDate}): ${e.description} (Skills: ${e.skillsUsed?.join(', ') || 'N/A'})`).join('\n\n');
            form.setValue("experience", experienceString);
        }
      });
    }
  }, [user, form]);

  const handleSubmit = async (values: ResumeBuilderFormValues) => {
    setIsGenerating(true);
    setFormattedResume("");

    try {
      const response = await formatResume(values);
      setFormattedResume(response.formattedResume);
    } catch (error) {
      console.error("Error formatting resume:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not format the resume. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    window.print();
  };

  const handleSaveToProfile = async () => {
    if (!formattedResume || !user) return;
    startSaving(async () => {
      try {
        const currentProfile = await api.getStudentProfile(user.id);
        if (!currentProfile) {
          throw new Error("Could not find profile to save to.");
        }

        const newResumeItem: ResumeItem = {
          id: `new-gen-${Date.now()}`,
          name: `${form.getValues('resumeStyle')} Resume - ${new Date().toLocaleDateString()}.html`,
          dataUri: formattedResume,
          type: 'generated',
          createdAt: new Date().toISOString(),
        };

        const updatedProfile = {
          ...currentProfile,
          resumes: [...(currentProfile.resumes || []), newResumeItem]
        };

        await api.updateStudentProfile(user.id, updatedProfile);
        
        toast({
          title: "Resume Saved!",
          description: "The generated resume has been saved to your profile.",
        });

      } catch (error) {
        console.error("Error saving resume to profile:", error);
        toast({
          variant: "destructive",
          title: "Save Failed",
          description: "Could not save the generated resume to your profile.",
        });
      }
    });
  }

  const resumePreviews = {
    ATS: {
      src: PlaceHolderImages.find(p => p.id === 'ats-resume')?.imageUrl || "/images/ats-resume.webp",
      hint: "ATS resume",
      description: "A clean, single-column resume optimized for applicant tracking systems.",
    },
    Minimalist: {
      src: PlaceHolderImages.find(p => p.id === 'minimalist-resume')?.imageUrl || `/images/minimalist-resume.webp`,
      hint: "minimalist resume",
      description: "An elegant, simple design with a focus on typography and whitespace.",
    },
    Graphical: {
      src: PlaceHolderImages.find(p => p.id === 'graphical-resume')?.imageUrl || `/images/graphical-resume.webp`,
      hint: "graphical resume",
      description: "A creative layout that uses visual elements to highlight skills and experience.",
    },
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Resume Builder"
        description="Enter your details and let AI create a professional resume template for you."
      />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
         <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Style</CardTitle>
                <CardDescription>
                    Choose a template for your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                    control={form.control}
                    name="resumeStyle"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="gap-4">
                                {(['ATS', 'Minimalist', 'Graphical'] as const).map((style) => (
                                    <FormItem key={style} className="flex items-center space-x-2">
                                        <FormControl>
                                            <RadioGroupItem value={style} id={style.toLowerCase()} />
                                        </FormControl>
                                        <Label htmlFor={style.toLowerCase()} className="flex items-center gap-2 cursor-pointer">
                                        {style === "ATS" ? "ATS-Friendly" : style}
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Info className="h-4 w-4 text-muted-foreground" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="p-2 space-y-2">
                                                    <Image
                                                    src={resumePreviews[style].src}
                                                    alt={`${style} resume preview`}
                                                    width={200}
                                                    height={280}
                                                    className="rounded-md border"
                                                    data-ai-hint={resumePreviews[style].hint}
                                                    />
                                                    <p className="text-xs max-w-[200px] text-center text-muted-foreground">{resumePreviews[style].description}</p>
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                        </Label>
                                    </FormItem>
                                ))}
                                </RadioGroup>
                            </FormControl>
                        </FormItem>
                    )}
                    />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
                <CardDescription>
                  Provide the content for your resume.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="education"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Education</FormLabel>
                            <FormControl><Textarea rows={3} placeholder="e.g., B.Tech in Computer Science, ABC University, 2020-2024" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl><Textarea rows={3} placeholder="e.g., React, Node.js, Python, SQL" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
                <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Experience</FormLabel>
                            <FormControl><Textarea rows={6} placeholder="e.g., Software Engineer Intern at XYZ Corp (Summer 2023)..." {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                 />
              </CardContent>
            </Card>
            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {isGenerating ? "Building..." : "Build Resume"}
            </Button>
          </form>
          </Form>
        </div>
        <div className="md:col-span-2">
          <Card className="min-h-[600px] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Formatted Resume</CardTitle>
                <CardDescription>
                  Your formatted resume will appear below.
                </CardDescription>
              </div>
              {formattedResume && (
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={handleSaveToProfile} disabled={isSaving}>
                     {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                     {isSaving ? "Saving..." : "Save to Profile"}
                  </Button>
                  <Button variant="outline" onClick={handleDownload}>
                    <Download /> Download PDF
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {isGenerating && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {formattedResume && (
                <div id="resume-container" className="w-full aspect-[210/297] scale-100 origin-top-left border bg-background shadow-lg">
                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{formattedResume}</ReactMarkdown>
                </div>
              )}
              {!isGenerating && !formattedResume && (
                <div className="flex flex-col items-center justify-center text-center h-96 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">
                    Your resume will be displayed here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
