

"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Download, Sparkles, X, Loader2, FileText, Calendar, Briefcase, Dot, Shield, Users, CircleDot, Mail } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Application, Company, Drive, StudentProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { summarizeDrive } from "@/ai/flows/summarize-drive";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmailGenerator, type EmailGeneratorProps } from "@/components/email-generator";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";


const getCurrentStatus = (app: Application) => app.statusUpdates[app.statusUpdates.length - 1].status;

const applyFormSchema = z.object({
    coverLetter: z.string().min(10, { message: "Your statement must be at least 10 characters." }),
});
type ApplyFormValues = z.infer<typeof applyFormSchema>;


function TpoDriveDetailView({ drive, company }: { drive: Drive, company?: Company }) {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [emailGenProps, setEmailGenProps] = useState<EmailGeneratorProps | null>(null);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const appData = await api.getApplicationsByDriveId(drive.id);
            setApplications(appData);
            
            if (appData.length > 0) {
              const studentIds = [...new Set(appData.map(app => app.studentId))];
              const studentData = await Promise.all(
                  studentIds.map(id => api.getStudentProfileByStudentId(id))
              );
              setStudents(studentData.filter((s): s is StudentProfile => !!s));
            }

        } catch (error) {
            console.error("Failed to fetch drive details", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [drive.id]);
  
  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      const updatedApplication = await api.updateApplicationStatus(applicationId, newStatus);
      if (updatedApplication) {
        setApplications(prev => 
            prev.map(app => app.id === applicationId ? updatedApplication : app)
        );
        toast({
            title: "Status Updated",
            description: `The application status has been changed to "${newStatus}".`
        });
      }
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not update the application status.",
        });
    } finally {
        setIsEmailDialogOpen(false);
    }
  }

  const getStudent = (studentId: string) => students.find(s => s.studentId === studentId);
  
  const getStatusVariant = (status: string) => {
    const lowerCaseStatus = status.toLowerCase();
    if (lowerCaseStatus.includes('offer')) return 'default';
    if (lowerCaseStatus.includes('reject')) return 'destructive';
    if (lowerCaseStatus.includes('interview') || lowerCaseStatus.includes('round')) return 'outline';
    return 'secondary';
  }

  const handleOpenEmailGenerator = (app: Application, student: StudentProfile, stage: string) => {
    if (!company) return;
    setEmailGenProps({
        applicationId: app.id,
        stage: stage,
        stages: drive.stages,
        studentName: student.name,
        companyName: company.name,
        role: drive.title,
        onEmailSent: handleStatusUpdate
    });
    setIsEmailDialogOpen(true);
  }

  const getNextStage = (currentStatus: string) => {
    const currentIndex = drive.stages.findIndex(s => s.toLowerCase() === currentStatus.toLowerCase());
    if (currentIndex > -1 && currentIndex < drive.stages.length - 1) {
        return drive.stages[currentIndex + 1];
    }
    return null;
  }

  return (
    <div className="space-y-6">
      <DriveHeader drive={drive} company={company} />
      
      <Card>
        <CardHeader>
          <CardTitle>Applicants</CardTitle>
          <CardDescription>
            List of students who applied for this drive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  <TableRow><TableCell colSpan={5}><Skeleton className="w-full h-10" /></TableCell></TableRow>
              ) : applications.length > 0 ? (
                applications.map((app) => {
                const student = getStudent(app.studentId);
                if (!student) return null;
                const currentStatus = getCurrentStatus(app);
                const nextStage = getNextStage(currentStatus);
                return (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={PlaceHolderImages.find(p => p.id === student.studentId)?.imageUrl || `https://picsum.photos/seed/${student.studentId}/40/40`} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.cgpa}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(currentStatus)} className="capitalize">{currentStatus}</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                        {nextStage && !currentStatus.toLowerCase().includes('reject') && (
                            <Button variant="outline" size="sm" onClick={() => handleOpenEmailGenerator(app, student, nextStage)}>
                                <Mail className="mr-2 h-4 w-4" />
                                Promote to {nextStage}
                            </Button>
                        )}
                        {!currentStatus.toLowerCase().includes('reject') && !currentStatus.toLowerCase().includes('offer') &&(
                             <Button variant="destructive" size="sm" onClick={() => handleOpenEmailGenerator(app, student, 'Rejected')}>
                                <X className="mr-2 h-4 w-4"/>
                                Reject
                            </Button>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No students have applied for this drive yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {emailGenProps && (
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
            <DialogContent className="max-w-4xl">
                 <DialogHeader>
                    <DialogTitle>Generate Email</DialogTitle>
                    <DialogDescription>
                        Generate a "{emailGenProps.stage}" email for {emailGenProps.studentName}.
                    </DialogDescription>
                </DialogHeader>
                <EmailGenerator {...emailGenProps} />
            </DialogContent>
        </Dialog>
      )}

    </div>
  );
}

function StudentDriveDetailView({ drive, company }: { drive: Drive, company?: Company }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [myApplication, setMyApplication] = useState<Application | null | undefined>(undefined);
    const [summary, setSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [isApplyDialogOpen, setIsApplyDialogOpen] = useState(false);
    
    const form = useForm<ApplyFormValues>({
        resolver: zodResolver(applyFormSchema),
        defaultValues: { coverLetter: "" },
    });

    useEffect(() => {
        if (user) {
            api.getApplicationsByStudentId(user.id).then(apps => {
                const thisApp = apps.find(app => app.driveId === drive.id);
                setMyApplication(thisApp || null);
            })
        }
    }, [user, drive.id]);


    const handleApply = async (values: ApplyFormValues) => {
        if (!user) return;
        try {
            const newApplication = await api.createApplication(user.id, drive.id, values.coverLetter);
            setMyApplication(newApplication);
            toast({
                title: "Applied Successfully!",
                description: `Your application for ${drive.title} has been submitted.`,
            });
            setIsApplyDialogOpen(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Application Failed",
                description: "There was an error submitting your application.",
            });
        }
    }

    const handleGenerateSummary = async () => {
        setIsGeneratingSummary(true);
        setSummary('');
        try {
            const result = await summarizeDrive({ jobDescription: drive.description });
            setSummary(result.summary);
        } catch (error) {
             toast({
                variant: "destructive",
                title: "Summary Failed",
                description: "Could not generate the AI summary for this drive.",
            });
        } finally {
            setIsGeneratingSummary(false);
        }
    }
    
    const isApplying = form.formState.isSubmitting;

    return (
        <div className="space-y-6">
            <DriveHeader drive={drive} company={company} />
            
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Your Application</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {myApplication === undefined && <Skeleton className="h-24" />}
                            {myApplication === null && (
                                <div className="text-center py-8 space-y-4">
                                    <p className="text-muted-foreground">You have not applied to this drive yet.</p>
                                    <Dialog open={isApplyDialogOpen} onOpenChange={setIsApplyDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>Apply Now</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <Form {...form}>
                                                <form onSubmit={form.handleSubmit(handleApply)}>
                                                    <DialogHeader>
                                                        <DialogTitle>Apply to {drive.title}</DialogTitle>
                                                        <DialogDescription>
                                                            Briefly tell us why you're a great fit for this role. This statement is required.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="py-4">
                                                        <FormField
                                                            control={form.control}
                                                            name="coverLetter"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel htmlFor="coverLetter" className="sr-only">Your Statement</FormLabel>
                                                                    <FormControl>
                                                                        <Textarea 
                                                                            id="coverLetter"
                                                                            placeholder="Introduce yourself and explain your interest in this company and role..."
                                                                            rows={8}
                                                                            {...field}
                                                                        />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                    <DialogFooter>
                                                        <Button variant="outline" type="button" onClick={() => setIsApplyDialogOpen(false)}>Cancel</Button>
                                                        <Button type="submit" disabled={isApplying}>
                                                            {isApplying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                            {isApplying ? "Submitting..." : "Submit Application"}
                                                        </Button>
                                                    </DialogFooter>
                                                </form>
                                            </Form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            )}

                            {myApplication && (
                                <div className="text-center py-8 space-y-4">
                                     <p className="text-muted-foreground">You have already applied for this drive.</p>
                                     <Dialog>
                                         <DialogTrigger asChild>
                                             <Button variant="outline">
                                                 <FileText className="mr-2 h-4 w-4" />
                                                 View Cover Letter
                                             </Button>
                                         </DialogTrigger>
                                         <DialogContent>
                                             <DialogHeader>
                                                 <DialogTitle>Your Cover Letter for {drive.title}</DialogTitle>
                                             </DialogHeader>
                                             <div className="py-4">
                                                 <p className="text-sm text-muted-foreground whitespace-pre-wrap">{myApplication.coverLetter}</p>
                                             </div>
                                         </DialogContent>
                                     </Dialog>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Drive Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">{drive.description}</p>
                        </CardContent>
                    </Card>
                </div>
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Assistant</CardTitle>
                             <CardDescription>Get a quick summary of the job description.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button onClick={handleGenerateSummary} disabled={isGeneratingSummary} className="w-full">
                                {isGeneratingSummary ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="mr-2 h-4 w-4" />
                                )}
                                {isGeneratingSummary ? "Summarizing..." : "Summarize Drive"}
                            </Button>
                            {summary && (
                                <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-lg bg-muted/20">
                                    <p>{summary}</p>
                                </div>
                            )}
                             {isGeneratingSummary && (
                                <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function DriveHeader({ drive, company }: { drive: Drive, company?: Company }) {
    
    const formatCtc = (ctc: Drive['ctc']) => {
        return `${ctc.value.toLocaleString()} ${ctc.unit}`;
    }

    return (
        <div>
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/drives"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Drives</Link>
            </Button>
            <PageHeader title={drive.title} description={company?.name} />
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                 <div className="flex items-center gap-2">
                    <CircleDot />
                    <span>{formatCtc(drive.ctc)}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Briefcase />
                    <span>{drive.employmentType}</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Users />
                    <span>{drive.roles.join(', ')}</span>
                </div>
                {drive.driveDate && (
                    <div className="flex items-center gap-2">
                        <Calendar />
                        <span>Drive started on {new Date(drive.driveDate).toLocaleDateString()}</span>
                    </div>
                )}
            </div>
             <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-sm">Eligibility Criteria</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    {drive.minCgpa && <div className="flex items-center gap-2"><Shield /> CGPA: {drive.minCgpa}+</div>}
                    {drive.allowedBacklogs !== undefined && <div className="flex items-center gap-2"><Dot /> Backlogs: {drive.allowedBacklogs}</div>}
                    {drive.eligibleBranches && <div className="flex items-center gap-2"><Dot /> Branches: {drive.eligibleBranches.join(', ')}</div>}
                </div>
             </div>
        </div>
    )
}


export default function DriveDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [drive, setDrive] = useState<Drive | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const driveId = params.id;
    if (!driveId) return;

    const fetchData = async () => {
        try {
            const driveData = await api.getDriveById(driveId);
            if (driveData) {
                setDrive(driveData);
                const companyData = await api.getCompanyById(driveData.companyId);
                setCompany(companyData || null);
            } else {
                 notFound();
            }
        } catch (error) {
             notFound();
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [params.id]);


  if (loading || !drive) {
    return (
        <div className="space-y-6">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-8 w-1/2" />
            <div className="grid md:grid-cols-3 gap-4">
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
                <Skeleton className="h-6" />
            </div>
            <Skeleton className="h-20" />
            <Skeleton className="h-64" />
        </div>
    );
  }

  if (!user) return null;

  return user.role === "tpo" || user.role === "hod" ? (
    <TpoDriveDetailView drive={drive} company={company || undefined} />
  ) : (
    <StudentDriveDetailView drive={drive} company={company || undefined} />
  );
}
