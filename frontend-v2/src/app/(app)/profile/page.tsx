
"use client";

import { useEffect, useState, useTransition } from "react";
import { useAuth } from "@/hooks/use-auth";
import { notFound } from "next/navigation";
import * as api from "@/lib/api";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";
import type { StudentProfile, EducationItem, ExperienceItem, CertificationItem } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Building, Calendar, Edit, Loader2, Plus, Save, Trash2, XCircle, BadgeCheck, ShieldQuestion, Award, CheckSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, startSaving] = useTransition();
  const [originalProfile, setOriginalProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (user && user.role === 'student') {
        api.getStudentProfile(user.id)
            .then(data => {
                if (data) {
                    setProfile(data);
                    setOriginalProfile(JSON.parse(JSON.stringify(data)));
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not load your profile.' });
                }
            })
            .finally(() => setLoading(false));
    }
  }, [user, toast]);


  if (!user || user.role !== "student") {
    notFound();
  }

  const handleFileSelect = (file: File) => {
    toast({
      title: "Resume Uploaded",
      description: `${file.name} has been successfully uploaded.`
    });
  }
  
  const handleSave = () => {
    if (!profile) return;
    startSaving(async () => {
      try {
        const updatedProfile = await api.updateStudentProfile(user.id, profile);
        if (updatedProfile) {
          setProfile(updatedProfile);
          setOriginalProfile(JSON.parse(JSON.stringify(updatedProfile)));
          toast({ title: "Profile Saved", description: "Your changes have been saved successfully." });
          setIsEditing(false);
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save your changes." });
      }
    });
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setProfile(originalProfile);
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setProfile(prev => prev ? ({...prev, [name]: value}) : null)
  }
  
  const handleSkillsChange = (value: string) => {
    setProfile(prev => prev ? ({...prev, skills: value.split(',').map(s => s.trim())}) : null)
  }

  const handleEducationChange = (index: number, field: keyof EducationItem, value: string) => {
    if (!profile) return;
    const newEducation = [...profile.education];
    newEducation[index] = {...newEducation[index], [field]: value, verified: false}; // Mark as unverified on edit
    setProfile({...profile, education: newEducation});
  }

  const addEducation = () => {
    if (!profile) return;
    const newEducation: EducationItem = { id: `new-edu-${Date.now()}`, degree: "", institution: "", startDate: "", endDate: "", grade: "", verified: false };
    setProfile({...profile, education: [...profile.education, newEducation]});
  }

  const removeEducation = (index: number) => {
    if (!profile) return;
    const newEducation = profile.education.filter((_, i) => i !== index);
    setProfile({...profile, education: newEducation});
  }

  const handleExperienceChange = (index: number, field: keyof ExperienceItem, value: string | string[]) => {
    if (!profile) return;
    const newExperience = [...profile.experience];
    const updatedItem = {...newExperience[index], [field]: value, verified: false}; // Mark as unverified on edit
    newExperience[index] = updatedItem;
    setProfile({...profile, experience: newExperience});
  }

  const addExperience = () => {
    if (!profile) return;
    const newExperience: ExperienceItem = { id: `new-exp-${Date.now()}`, role: "", company: "", startDate: "", endDate: "", description: "", skillsUsed: [], verified: false };
    setProfile({...profile, experience: [...profile.experience, newExperience]});
  }

  const removeExperience = (index: number) => {
    if (!profile) return;
    const newExperience = profile.experience.filter((_, i) => i !== index);
    setProfile({...profile, experience: newExperience});
  }
  
  const handleCertificationChange = (index: number, field: keyof CertificationItem, value: string) => {
    if (!profile) return;
    const newCertifications = [...profile.certifications];
    newCertifications[index] = {...newCertifications[index], [field]: value, verified: false};
    setProfile({...profile, certifications: newCertifications});
  }

  const addCertification = () => {
    if (!profile) return;
    const newCertification: CertificationItem = { id: `new-cert-${Date.now()}`, name: "", issuingOrganization: "", issueDate: "", credentialId: "", verified: false };
    setProfile({...profile, certifications: [...profile.certifications, newCertification]});
  }

  const removeCertification = (index: number) => {
    if (!profile) return;
    const newCertifications = profile.certifications.filter((_, i) => i !== index);
    setProfile({...profile, certifications: newCertifications});
  }


  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };

  if (loading) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="My Profile"
                description="View and manage your personal and academic information."
            />
            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-8 w-1/2" />
                             <Skeleton className="h-24 w-full" />
                             <Skeleton className="h-24 w-full" />
                        </CardContent>
                    </Card>
                </div>
                 <div className="space-y-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
            </div>
        </div>
    )
  }

  if (!profile) {
    return <div>Profile not found.</div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-start">
            <PageHeader
                title="My Profile"
                description="View and manage your personal and academic information."
            />
            {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                    <Edit /> Edit Profile
                </Button>
            ) : (
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                        <XCircle /> Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            )}
        </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Name</Label>
                  <Input name="name" value={profile.name} onChange={handleProfileChange} readOnly={!isEditing} />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input name="email" value={profile.email} readOnly />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Department</Label>
                  <Input name="department" value={profile.department} onChange={handleProfileChange} readOnly={!isEditing} />
                </div>
                <div className="space-y-1">
                  <Label>CGPA</Label>
                  <Input name="cgpa" type="number" value={profile.cgpa} onChange={handleProfileChange} readOnly={!isEditing} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Skills</Label>
                {isEditing ? (
                  <Input
                    placeholder="Enter skills, separated by commas"
                    value={profile.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                      {profile.skills.map(skill => (
                          <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Education</CardTitle>
              {isEditing && <Button size="sm" variant="outline" onClick={addEducation}><Plus className="mr-2"/>Add</Button>}
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.education.map((edu, index) => (
                <div key={edu.id}>
                  {isEditing ? (
                    <div className="space-y-2 p-4 border rounded-lg relative">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeEducation(index)}><Trash2 className="text-destructive"/></Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Degree" value={edu.degree} onChange={e => handleEducationChange(index, "degree", e.target.value)}/>
                            <Input placeholder="Institution" value={edu.institution} onChange={e => handleEducationChange(index, "institution", e.target.value)}/>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <Input placeholder="Start Date" value={edu.startDate} onChange={e => handleEducationChange(index, "startDate", e.target.value)}/>
                            <Input placeholder="End Date" value={edu.endDate} onChange={e => handleEducationChange(index, "endDate", e.target.value)}/>
                            <Input placeholder="Grade/CGPA" value={edu.grade} onChange={e => handleEducationChange(index, "grade", e.target.value)}/>
                        </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                           <h3 className="font-semibold">{edu.degree}</h3>
                           {edu.verified ? <BadgeCheck className="h-5 w-5 text-green-500" /> : <ShieldQuestion className="h-5 w-5 text-amber-500" />}
                        </div>
                        <div className="text-right text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {edu.startDate} - {edu.endDate}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                        <Building className="h-4 w-4" /> {edu.institution}
                      </p>
                      <p className="text-sm font-medium mt-1">Grade: {edu.grade}</p>
                    </>
                  )}
                  {index < profile.education.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Experience</CardTitle>
               {isEditing && <Button size="sm" variant="outline" onClick={addExperience}><Plus className="mr-2"/>Add</Button>}
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.experience.map((exp, index) => (
                <div key={exp.id}>
                    {isEditing ? (
                         <div className="space-y-2 p-4 border rounded-lg relative">
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeExperience(index)}><Trash2 className="text-destructive"/></Button>
                            <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Role" value={exp.role} onChange={e => handleExperienceChange(index, "role", e.target.value)}/>
                                <Input placeholder="Company" value={exp.company} onChange={e => handleExperienceChange(index, "company", e.target.value)}/>
                            </div>
                             <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Start Date" value={exp.startDate} onChange={e => handleExperienceChange(index, "startDate", e.target.value)}/>
                                <Input placeholder="End Date" value={exp.endDate} onChange={e => handleExperienceChange(index, "endDate", e.target.value)}/>
                            </div>
                            <Textarea placeholder="Description" value={exp.description} onChange={e => handleExperienceChange(index, "description", e.target.value)} />
                            <Input placeholder="Skills Used (comma-separated)" value={(exp.skillsUsed || []).join(', ')} onChange={e => handleExperienceChange(index, "skillsUsed", e.target.value.split(',').map(s => s.trim()))}/>
                        </div>
                    ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{exp.role}</h3>
                          {exp.verified ? <BadgeCheck className="h-5 w-5 text-green-500" /> : <ShieldQuestion className="h-5 w-5 text-amber-500" />}
                        </div>
                        <div className="text-right text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> {exp.startDate} - {exp.endDate}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                        <Briefcase className="h-4 w-4" /> {exp.company}
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">{exp.description}</p>
                      {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                        <div className="mt-3">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Skills Used:</p>
                            <div className="flex flex-wrap gap-1">
                                {exp.skillsUsed.map(skill => (
                                    <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                ))}
                            </div>
                        </div>
                      )}
                    </>
                    )}
                  {index < profile.experience.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Certifications</CardTitle>
              {isEditing && <Button size="sm" variant="outline" onClick={addCertification}><Plus className="mr-2"/>Add</Button>}
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.certifications.map((cert, index) => (
                <div key={cert.id}>
                  {isEditing ? (
                    <div className="space-y-2 p-4 border rounded-lg relative">
                        <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => removeCertification(index)}><Trash2 className="text-destructive"/></Button>
                        <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Certification Name" value={cert.name} onChange={e => handleCertificationChange(index, "name", e.target.value)}/>
                            <Input placeholder="Issuing Organization" value={cert.issuingOrganization} onChange={e => handleCertificationChange(index, "issuingOrganization", e.target.value)}/>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <Input placeholder="Issue Date" value={cert.issueDate} onChange={e => handleCertificationChange(index, "issueDate", e.target.value)}/>
                            <Input placeholder="Credential ID (Optional)" value={cert.credentialId} onChange={e => handleCertificationChange(index, "credentialId", e.target.value)}/>
                        </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                           <h3 className="font-semibold">{cert.name}</h3>
                           {cert.verified ? <BadgeCheck className="h-5 w-5 text-green-500" /> : <ShieldQuestion className="h-5 w-5 text-amber-500" />}
                        </div>
                        <div className="text-right text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar className="h-4 w-4" /> Issued {cert.issueDate}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                        <Award className="h-4 w-4" /> {cert.issuingOrganization}
                      </p>
                      {cert.credentialId && <p className="text-sm font-medium mt-1">ID: {cert.credentialId}</p>}
                    </>
                  )}
                  {index < profile.certifications.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card className="flex flex-col items-center text-center p-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-3xl">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{profile.department}</p>
          </Card>

           <Card>
            <CardHeader>
                <CardTitle>My Résumé</CardTitle>
                <CardDescription>Upload your latest résumé in PDF format.</CardDescription>
            </CardHeader>
            <CardContent>
                <FileUpload onFileSelect={handleFileSelect} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
