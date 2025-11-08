

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
import type { StudentProfile, EducationItem, ExperienceItem, CertificationItem, ResumeItem, DateField } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Building, Calendar, Edit, Loader2, Plus, Save, Trash2, XCircle, BadgeCheck, ShieldQuestion, Award, File, Download, Eye, Upload } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { parseResume } from "@/ai/flows/parse-resume";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { useForm, FormProvider, useFieldArray, useWatch, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const months = [
    { label: "Jan", value: 1 }, { label: "Feb", value: 2 }, { label: "Mar", value: 3 },
    { label: "Apr", value: 4 }, { label: "May", value: 5 }, { label: "Jun", value: 6 },
    { label: "Jul", value: 7 }, { label: "Aug", value: 8 }, { label: "Sep", value: 9 },
    { label: "Oct", value: 10 }, { label: "Nov", value: 11 }, { label: "Dec", value: 12 }
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1950 + 1 }, (_, i) => currentYear - i);

const dateFieldSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(1950).max(currentYear),
}).refine(date => {
    if (date.year === currentYear) {
        return date.month <= new Date().getMonth() + 1;
    }
    return true;
}, { message: "Date cannot be in the future." });

const educationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1, "Degree is required."),
  institution: z.string().min(1, "Institution is required."),
  startDate: dateFieldSchema,
  endDate: z.union([dateFieldSchema, z.literal('Present')]),
  grade: z.string().min(1, "Grade is required."),
  verified: z.boolean().optional(),
}).refine(data => {
    if (data.endDate !== 'Present' && data.startDate && data.endDate) {
      if (data.startDate.year > data.endDate.year) return false;
      if (data.startDate.year === data.endDate.year && data.startDate.month > data.endDate.month) return false;
    }
    return true;
}, {
    message: "End date cannot be earlier than start date.",
    path: ["endDate"],
});

const experienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1, "Role is required."),
  company: z.string().min(1, "Company is required."),
  startDate: dateFieldSchema,
  endDate: z.union([dateFieldSchema, z.literal('Present')]),
  description: z.string().min(1, "Description is required."),
  skillsUsed: z.array(z.string()).optional(),
  verified: z.boolean().optional(),
}).refine(data => {
    if (data.endDate !== 'Present' && data.startDate && data.endDate) {
        if (data.startDate.year > data.endDate.year) return false;
        if (data.startDate.year === data.endDate.year && data.startDate.month > data.endDate.month) return false;
    }
    return true;
}, {
    message: "End date cannot be earlier than start date.",
    path: ["endDate"],
});

const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Certification name is required."),
  issuingOrganization: z.string().min(1, "Organization is required."),
  issueDate: dateFieldSchema,
  credentialId: z.string().optional(),
  verified: z.boolean().optional(),
})

const resumeSchema = z.object({
    id: z.string(),
    name: z.string(),
    dataUri: z.string(),
    type: z.enum(['uploaded', 'generated']),
    createdAt: z.string(),
});

const profileFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email(),
  department: z.string().min(1, "Department is required."),
  cgpa: z.coerce.number().min(0, "CGPA must be between 0 and 10.").max(10, "CGPA cannot exceed 10."),
  photoDataUri: z.string().optional(),
  skills: z.array(z.string()).min(1, "At least one skill is required."),
  education: z.array(educationSchema),
  experience: z.array(experienceSchema),
  certifications: z.array(certificationSchema),
  resumes: z.array(resumeSchema).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const DateSelector = ({
    control,
    name,
    isEndDate = false
}: {
    control: Control<any>; // Use 'any' here as this component can be used in different forms
    name: string; // Generic name to support nested fields
    isEndDate?: boolean;
}) => {
    const isPresent = useWatch({ control, name: `${name}IsPresent` });
    const dateValue = useWatch({ control, name });
    const isPresentChecked = isEndDate && (isPresent || dateValue === 'Present');

    const fieldNameMonth = `${name}.month`;
    const fieldNameYear = `${name}.year`;

    return (
        <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
                <FormField
                    control={control}
                    name={fieldNameMonth}
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isPresentChecked}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Month" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {months.map(m => <SelectItem key={m.value} value={m.value.toString()}>{m.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={control}
                    name={fieldNameYear}
                    render={({ field }) => (
                        <FormItem>
                            <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isPresentChecked}>
                                <FormControl>
                                    <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {years.map(y => <SelectItem key={y} value={y.toString()}>{y}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {isEndDate && (
                 <FormField
                    control={control}
                    name={`${name}IsPresent`}
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value || dateValue === 'Present'}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked);
                                        const fieldName = name.replace('IsPresent', '');
                                        if(checked) {
                                            form.setValue(fieldName as any, 'Present');
                                        } else {
                                            form.setValue(fieldName as any, { month: new Date().getMonth() + 1, year: new Date().getFullYear() });
                                        }
                                    }}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Ongoing</FormLabel>
                            </div>
                        </FormItem>
                    )}
                />
            )}
        </div>
    );
};

// Global form instance to be used in the DateSelector component
let form: any;

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isParsing, startParsing] = useTransition();

  form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange"
  });
  
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "education"
  });
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = useFieldArray({
    control: form.control,
    name: "experience"
  });
  const { fields: certificationFields, append: appendCertification, remove: removeCertification } = useFieldArray({
    control: form.control,
    name: "certifications"
  });
  const { fields: resumeFields, append: appendResume, remove: removeResume } = useFieldArray({
    control: form.control,
    name: "resumes"
  });


  useEffect(() => {
    if (user && user.role === 'student') {
        setLoading(true);
        api.getStudentProfile(user.id)
            .then(data => {
                if (data) {
                    setProfile(data);
                    // This is a migration step for old string dates to the new object structure.
                    const migratedData = {
                        ...data,
                        education: data.education.map(edu => ({
                            ...edu,
                            startDate: typeof edu.startDate === 'string' ? { month: 6, year: 2020 } : edu.startDate,
                            endDate: typeof edu.endDate === 'string' && edu.endDate !== 'Present' ? { month: 5, year: 2024 } : edu.endDate,
                        })),
                         experience: data.experience.map(exp => ({
                            ...exp,
                            startDate: typeof exp.startDate === 'string' ? { month: 6, year: 2023 } : exp.startDate,
                            endDate: typeof exp.endDate === 'string' && exp.endDate !== 'Present' ? { month: 8, year: 2023 } : exp.endDate,
                        })),
                        certifications: data.certifications.map(cert => ({
                            ...cert,
                            issueDate: typeof cert.issueDate === 'string' ? { month: 1, year: 2023 } : cert.issueDate,
                        })),
                        resumes: data.resumes || [],
                    };
                    form.reset(migratedData);
                } else {
                    toast({ variant: 'destructive', title: 'Error', description: 'Could not load your profile.' });
                }
            })
            .finally(() => setLoading(false));
    }
  }, [user, toast, form]);


  if (!user || user.role !== "student") {
    notFound();
  }

  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const handleResumeUpload = (file: File) => {
    startParsing(async () => {
        toast({
            title: "Parsing Resume...",
            description: "The AI is extracting your information. Please wait.",
        });
        try {
            const resumeDataUri = await fileToDataUri(file);
            const parsedData = await parseResume({ resumeDataUri });

            const currentSkills = form.getValues("skills") || [];
            const newSkills = [...new Set([...currentSkills, ...parsedData.skills])];
            form.setValue("skills", newSkills, { shouldValidate: true, shouldDirty: true });

            // @ts-ignore
            parsedData.education.forEach(item => appendEducation({ ...item, id: `new-${Date.now()}` }, { shouldFocus: false }));
            // @ts-ignore
            parsedData.experience.forEach(item => appendExperience({ ...item, id: `new-${Date.now()}`}, { shouldFocus: false }));
            parsedData.certifications.forEach(item => appendCertification({ ...item, id: `new-${Date.now()}` }, { shouldFocus: false }));
            
            const newResume: ResumeItem = {
                id: `new-resume-${Date.now()}`,
                name: file.name,
                dataUri: resumeDataUri,
                type: 'uploaded',
                createdAt: new Date().toISOString()
            }
            appendResume(newResume);

            form.trigger();
            setIsEditing(true);

            toast({
                title: "Resume Parsed & Added!",
                description: "Your profile has been updated. Please review and save the changes.",
            });

        } catch (error) {
            console.error("Error parsing resume:", error);
            toast({
                variant: "destructive",
                title: "AI Parsing Failed",
                description: "Could not extract information from the resume.",
            });
        }
    });
  };

  const handlePhotoUpload = async (file: File) => {
    const photoDataUri = await fileToDataUri(file);
    form.setValue('photoDataUri', photoDataUri, { shouldDirty: true });
    setIsEditing(true);
    toast({
        title: "Photo Updated",
        description: "Your new profile photo is ready. Don't forget to save your changes.",
    });
  }
  
  const handleSave = async (data: ProfileFormValues) => {
    if (!profile) return;
      try {
        const updatedProfile = await api.updateStudentProfile(user.id, data as StudentProfile);
        if (updatedProfile) {
          form.reset(updatedProfile);
          setIsEditing(false);
          toast({ title: "Profile Saved", description: "Your changes have been saved successfully." });
        } else {
          throw new Error("Failed to update profile");
        }
      } catch (err) {
        toast({ variant: "destructive", title: "Save Failed", description: "Could not save your changes." });
      }
  };
  
  const handleCancel = () => {
    if (profile) {
      form.reset({ ...profile, resumes: profile.resumes || []});
    }
    setIsEditing(false);
  }

  const handleDownloadResume = (dataUri: string, name: string) => {
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };
  
  const formatDate = (date: DateField | 'Present') => {
    if (date === 'Present') return 'Present';
    if(typeof date === 'string') return date;
    return `${months.find(m => m.value === date.month)?.label || ''} ${date.year}`;
  }

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
  
  const isSaving = form.formState.isSubmitting;


  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSave)}>
        <div className="space-y-6">
        <div className="flex justify-between items-start">
              <PageHeader
                  title="My Profile"
                  description="View and manage your personal and academic information."
              />
              {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} type="button">
                      <Edit /> Edit Profile
                  </Button>
              ) : (
                  <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancel} disabled={isSaving} type="button">
                          <XCircle /> Cancel
                      </Button>
                      <Button type="submit" disabled={isSaving || !form.formState.isDirty || !form.formState.isValid}>
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
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly={!isEditing} />
                          </FormControl>
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
                          <FormControl>
                            <Input {...field} readOnly />
                          </FormControl>
                           <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Department</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly={!isEditing} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                        control={form.control}
                        name="cgpa"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>CGPA</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} readOnly={!isEditing} />
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                   <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                                {isEditing ? (
                                <Input
                                    placeholder="Enter skills, separated by commas"
                                    value={field.value?.join(', ') || ''}
                                    onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                                />
                                ) : (
                                <div className="flex flex-wrap gap-2">
                                    {(field.value || []).map(skill => (
                                        <Badge key={skill} variant="secondary">{skill}</Badge>
                                    ))}
                                </div>
                                )}
                            </FormControl>
                             <FormMessage />
                            </FormItem>
                        )}
                        />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Education</CardTitle>
                {isEditing && <Button size="sm" variant="outline" type="button" onClick={() => appendEducation({ id: `new-edu-${Date.now()}`, degree: "", institution: "", startDate: { month: 1, year: currentYear }, endDate: "Present", grade: "", verified: false })}><Plus className="mr-2"/>Add</Button>}
              </CardHeader>
              <CardContent className="space-y-4">
                {educationFields.map((edu, index) => (
                  <div key={edu.id}>
                    {isEditing ? (
                      <div className="space-y-4 p-4 border rounded-lg relative">
                          <Button variant="ghost" size="icon" type="button" className="absolute top-2 right-2" onClick={() => removeEducation(index)}><Trash2 className="text-destructive"/></Button>
                          <FormField control={form.control} name={`education.${index}.degree`} render={({field}) => <FormItem><FormLabel>Degree</FormLabel><FormControl><Input placeholder="B.Tech in Computer Science" {...field} /></FormControl><FormMessage /></FormItem>} />
                          <FormField control={form.control} name={`education.${index}.institution`} render={({field}) => <FormItem><FormLabel>Institution</FormLabel><FormControl><Input placeholder="State University" {...field} /></FormControl><FormMessage /></FormItem>} />
                           <div className="grid grid-cols-2 gap-4">
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <DateSelector control={form.control} name={`education.${index}.startDate`} />
                                </FormItem>
                                 <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <DateSelector control={form.control} name={`education.${index}.endDate`} isEndDate />
                                </FormItem>
                           </div>
                           <FormField control={form.control} name={`education.${index}.grade`} render={({field}) => <FormItem><FormLabel>Grade</FormLabel><FormControl><Input placeholder="8.5 CGPA" {...field} /></FormControl><FormMessage /></FormItem>} />
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{edu.degree}</h3>
                            {edu.verified ? <BadgeCheck className="h-5 w-5 text-green-500" /> : <ShieldQuestion className="h-5 w-5 text-amber-500" />}
                          </div>
                          <div className="text-right text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                          <Building className="h-4 w-4" /> {edu.institution}
                        </p>
                        <p className="text-sm font-medium mt-1">Grade: {edu.grade}</p>
                      </>
                    )}
                    {index < educationFields.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Experience</CardTitle>
                {isEditing && <Button size="sm" variant="outline" type="button" onClick={() => appendExperience({ id: `new-exp-${Date.now()}`, role: "", company: "", startDate: { month: 1, year: currentYear }, endDate: "Present", description: "", skillsUsed: [], verified: false })}><Plus className="mr-2"/>Add</Button>}
              </CardHeader>
              <CardContent className="space-y-4">
                {experienceFields.map((exp, index) => (
                  <div key={exp.id}>
                      {isEditing ? (
                          <div className="space-y-4 p-4 border rounded-lg relative">
                              <Button variant="ghost" size="icon" type="button" className="absolute top-2 right-2" onClick={() => removeExperience(index)}><Trash2 className="text-destructive"/></Button>
                              <div className="grid grid-cols-2 gap-2">
                                <FormField control={form.control} name={`experience.${index}.role`} render={({field}) => <FormItem><FormLabel>Role</FormLabel><FormControl><Input placeholder="Role" {...field} /></FormControl><FormMessage /></FormItem>} />
                                <FormField control={form.control} name={`experience.${index}.company`} render={({field}) => <FormItem><FormLabel>Company</FormLabel><FormControl><Input placeholder="Company" {...field} /></FormControl><FormMessage /></FormItem>} />
                              </div>
                               <div className="grid grid-cols-2 gap-4">
                                <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <DateSelector control={form.control} name={`experience.${index}.startDate`} />
                                </FormItem>
                                 <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <DateSelector control={form.control} name={`experience.${index}.endDate`} isEndDate />
                                </FormItem>
                           </div>
                              <FormField control={form.control} name={`experience.${index}.description`} render={({field}) => <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Description" {...field} /></FormControl><FormMessage /></FormItem>} />
                              <FormField control={form.control} name={`experience.${index}.skillsUsed`} render={({field}) => <FormItem><FormLabel>Skills Used</FormLabel><FormControl><Input placeholder="Skills Used (comma-separated)" value={field.value?.join(', ') || ''} onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))} /></FormControl><FormMessage /></FormItem>} />
                          </div>
                      ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{exp.role}</h3>
                            {exp.verified ? <BadgeCheck className="h-5 w-5 text-green-500" /> : <ShieldQuestion className="h-5 w-5 text-amber-500" />}
                          </div>
                          <div className="text-right text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" /> {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
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
                    {index < experienceFields.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row justify-between items-center">
                <CardTitle>Certifications</CardTitle>
                {isEditing && <Button size="sm" variant="outline" type="button" onClick={() => appendCertification({ id: `new-cert-${Date.now()}`, name: "", issuingOrganization: "", issueDate: { month: 1, year: currentYear }, credentialId: "", verified: false })}><Plus className="mr-2"/>Add</Button>}
              </CardHeader>
              <CardContent className="space-y-4">
                {certificationFields.map((cert, index) => (
                  <div key={cert.id}>
                    {isEditing ? (
                      <div className="space-y-4 p-4 border rounded-lg relative">
                          <Button variant="ghost" size="icon" type="button" className="absolute top-2 right-2" onClick={() => removeCertification(index)}><Trash2 className="text-destructive"/></Button>
                          <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name={`certifications.${index}.name`} render={({field}) => <FormItem><FormLabel>Certification Name</FormLabel><FormControl><Input placeholder="Certification Name" {...field} /></FormControl><FormMessage /></FormItem>} />
                             <FormField control={form.control} name={`certifications.${index}.issuingOrganization`} render={({field}) => <FormItem><FormLabel>Issuing Organization</FormLabel><FormControl><Input placeholder="Issuing Organization" {...field} /></FormControl><FormMessage /></FormItem>} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Issue Date</FormLabel>
                                <DateSelector control={form.control} name={`certifications.${index}.issueDate`} />
                            </FormItem>
                            <FormField control={form.control} name={`certifications.${index}.credentialId`} render={({field}) => <FormItem><FormLabel>Credential ID</FormLabel><FormControl><Input placeholder="Credential ID (Optional)" {...field} /></FormControl><FormMessage /></FormItem>} />
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
                            <Calendar className="h-4 w-4" /> Issued {formatDate(cert.issueDate)}
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm flex items-center gap-2 mt-1">
                          <Award className="h-4 w-4" /> {cert.issuingOrganization}
                        </p>
                        {cert.credentialId && <p className="text-sm font-medium mt-1">ID: {cert.credentialId}</p>}
                      </>
                    )}
                    {index < certificationFields.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card className="flex flex-col items-center text-center p-6 relative">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={form.watch('photoDataUri') || user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-3xl">
                  {getInitials(user?.name || '')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                  <div className="absolute top-4 right-4">
                      <FileUpload onFileSelect={handlePhotoUpload} accept="image/*">
                          <Button size="icon" variant="outline" type="button">
                              <Upload className="h-4 w-4"/>
                          </Button>
                      </FileUpload>
                  </div>
              )}
              <h2 className="text-xl font-semibold">{user?.name}</h2>
              <p className="text-muted-foreground">{form.watch('department')}</p>
            </Card>

            <Card>
              <CardHeader>
                  <CardTitle>My Résumés</CardTitle>
                  <CardDescription>Upload a PDF to parse with AI and fill your profile.</CardDescription>
              </CardHeader>
              <CardContent>
                {isParsing ? (
                  <div className="flex items-center justify-center flex-col h-24 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p className="mt-2 text-sm">Parsing your resume...</p>
                  </div>
                ) : (
                  <FileUpload onFileSelect={handleResumeUpload} />
                )}
                <Separator className="my-6" />
                  <div className="space-y-3">
                      <h4 className="font-medium text-sm">Stored Resumes</h4>
                      {(resumeFields && resumeFields.length > 0) ? resumeFields.map((resume, index) => (
                          <div key={resume.id} className="flex items-center justify-between text-sm p-2 border rounded-md">
                              <div className="flex items-center gap-2">
                                  <File className="h-5 w-5 text-muted-foreground" />
                                  <span className="truncate flex-1">{resume.name}</span>
                                  <Badge variant={resume.type === 'generated' ? 'secondary' : 'outline'} className="text-xs">{resume.type}</Badge>
                              </div>
                              <div className="flex items-center gap-1">
                                  {resume.type === 'generated' ? (
                                      <Dialog>
                                          <DialogTrigger asChild>
                                              <Button variant="ghost" size="icon" type="button"><Eye /></Button>
                                          </DialogTrigger>
                                          <DialogContent className="max-w-4xl">
                                              <DialogHeader>
                                                  <DialogTitle>{resume.name}</DialogTitle>
                                              </DialogHeader>
                                              <div className="w-full aspect-[210/297] scale-100 origin-top-left border bg-background shadow-lg overflow-auto">
                                                  <ReactMarkdown rehypePlugins={[rehypeRaw]}>{resume.dataUri}</ReactMarkdown>
                                              </div>
                                          </DialogContent>
                                      </Dialog>
                                  ) : (
                                      <Button variant="ghost" size="icon" type="button" onClick={() => handleDownloadResume(resume.dataUri, resume.name)}>
                                          <Download />
                                      </Button>
                                  )}
                                  {isEditing && (
                                      <Button variant="ghost" size="icon" type="button" className="text-destructive" onClick={() => removeResume(index)}>
                                          <Trash2 />
                                      </Button>
                                  )}
                              </div>
                          </div>
                      )) : (
                          <p className="text-xs text-center text-muted-foreground py-4">No resumes stored yet.</p>
                      )}
                  </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </form>
    </FormProvider>
  );
}

    