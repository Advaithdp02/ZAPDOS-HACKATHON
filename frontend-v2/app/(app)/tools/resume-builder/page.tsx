
"use client";

import { useState } from "react";
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
import { Loader2, Sparkles, Copy, Info } from "lucide-react";
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

export default function ResumeBuilderPage() {
  const { user } = useAuth();
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", phone: "" });
  const [resumeStyle, setResumeStyle] = useState<"ATS" | "Minimalist" | "Graphical">("ATS");

  const [formattedResume, setFormattedResume] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      api.getStudentProfile(user.id).then(profile => {
        if (profile) {
          setContactInfo({ name: profile.name, email: profile.email, phone: "" });
          setSkills(profile.skills.join(', '));
          
          const educationString = profile.education.map(e => `${e.degree} at ${e.institution} (${e.startDate}-${e.endDate}) with ${e.grade}`).join('\n');
          setEducation(educationString);

          const experienceString = profile.experience.map(e => `${e.role} at ${e.company} (${e.startDate}-${e.endDate}): ${e.description} (Skills: ${e.skillsUsed?.join(', ') || 'N/A'})`).join('\n\n');
          setExperience(experienceString);
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills || !experience || !education || !contactInfo.name) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all required fields.",
      });
      return;
    }

    setLoading(true);
    setFormattedResume("");

    try {
      const response = await formatResume({
        ...contactInfo,
        skills,
        experience,
        education,
        resumeStyle,
      });
      setFormattedResume(response.formattedResume);
    } catch (error) {
      console.error("Error formatting resume:", error);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not format the resume. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedResume);
    toast({
      title: "Copied to Clipboard",
      description: "The formatted resume has been copied.",
    });
  };

  const resumePreviews = {
    ATS: {
      src: PlaceHolderImages.find(p => p.id === 'ats-resume')?.imageUrl || `https://picsum.photos/seed/ats-resume/300/400`,
      hint: "ATS resume",
      description: "A clean, single-column resume optimized for applicant tracking systems.",
    },
    Minimalist: {
      src: PlaceHolderImages.find(p => p.id === 'minimalist-resume')?.imageUrl || `https://picsum.photos/seed/minimalist-resume/300/400`,
      hint: "minimalist resume",
      description: "An elegant, simple design with a focus on typography and whitespace.",
    },
    Graphical: {
      src: PlaceHolderImages.find(p => p.id === 'graphical-resume')?.imageUrl || `https://picsum.photos/seed/graphical-resume/300/400`,
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Style</CardTitle>
                <CardDescription>
                    Choose a template for your resume.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={resumeStyle} onValueChange={(value: "ATS" | "Minimalist" | "Graphical") => setResumeStyle(value)} className="gap-4">
                  {(Object.keys(resumePreviews) as Array<keyof typeof resumePreviews>).map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <RadioGroupItem value={style} id={style.toLowerCase()} />
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
                      </div>
                  ))}
                </RadioGroup>
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
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" value={contactInfo.name} onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" value={contactInfo.email} onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Education</Label>
                  <Textarea
                    id="education"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g., B.Tech in Computer Science, ABC University, 2020-2024"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g., React, Node.js, Python, SQL"
                     rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Textarea
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g., Software Engineer Intern at XYZ Corp (Summer 2023)..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {loading ? "Building..." : "Build Resume"}
            </Button>
          </form>
        </div>
        <div className="md:col-span-2">
          <Card className="min-h-[600px]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Formatted Resume</CardTitle>
                <CardDescription>
                  Your formatted resume will appear below.
                </CardDescription>
              </div>
              {formattedResume && (
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
              {formattedResume && (
                <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-muted/20 whitespace-pre-wrap font-mono text-xs">
                  {formattedResume}
                </div>
              )}
              {!loading && !formattedResume && (
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
