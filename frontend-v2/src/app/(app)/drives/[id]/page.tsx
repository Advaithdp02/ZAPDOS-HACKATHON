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
import { ArrowLeft, Check, Download, X } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Application, Company, Drive, StudentProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";


const statusVariantMap: Record<Application["status"], "default" | "secondary" | "destructive" | "outline"> = {
    applied: "secondary",
    shortlisted: "outline",
    interview: "outline",
    offered: "default",
    rejected: "destructive",
};

function TpoDriveDetailView({ drive, company }: { drive: Drive, company?: Company }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const appData = await api.getApplicationsByDriveId(drive.id);
            setApplications(appData);
            
            // In a real app, you might have a bulk fetch endpoint
            const studentData = await Promise.all(
                appData.map(app => api.getStudentProfile(app.studentId))
            );
            setStudents(studentData.filter((s): s is StudentProfile => !!s));

        } catch (error) {
            console.error("Failed to fetch drive details", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [drive.id]);

  const getStudent = (studentId: string) => students.find(s => s.studentId === studentId);

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
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                  <TableRow><TableCell colSpan={5}><Skeleton className="w-full h-10" /></TableCell></TableRow>
              ) : applications.map((app) => {
                const student = getStudent(app.studentId);
                if (!student) return null;
                return (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://picsum.photos/seed/${student.studentId}/40/40`} />
                          <AvatarFallback>{student.name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{student.department}</TableCell>
                    <TableCell>{student.cgpa}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[app.status]} className="capitalize">{app.status}</Badge>
                    </TableCell>
                    <TableCell className="space-x-1">
                        <Button variant="outline" size="icon" className="h-8 w-8"><Check className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><X className="h-4 w-4"/></Button>
                        <Button variant="outline" size="icon" className="h-8 w-8"><Download className="h-4 w-4"/></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentDriveDetailView({ drive, company }: { drive: Drive, company?: Company }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [myApplication, setMyApplication] = useState<Application | null | undefined>(undefined);

    useEffect(() => {
        if (user) {
            api.getApplicationsByStudentId(user.id).then(apps => {
                const thisApp = apps.find(app => app.driveId === drive.id);
                setMyApplication(thisApp);
            })
        }
    }, [user, drive.id]);


    const handleApply = async () => {
        if (!user) return;
        try {
            const newApplication = await api.createApplication(user.id, drive.id);
            setMyApplication(newApplication);
            toast({
                title: "Applied Successfully!",
                description: `Your application for ${drive.title} has been submitted.`,
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Application Failed",
                description: "There was an error submitting your application.",
            });
        }
    }

    return (
        <div className="space-y-6">
            <DriveHeader drive={drive} company={company} />
            
            <Card>
                <CardHeader>
                    <CardTitle>Your Application Status</CardTitle>
                </CardHeader>
                <CardContent>
                    {myApplication === undefined ? (
                        <Skeleton className="h-10 w-1/2" />
                    ) : myApplication ? (
                        <div className="flex items-center space-x-4">
                            <p className="font-medium">Status:</p>
                            <Badge variant={statusVariantMap[myApplication.status]} className="text-base capitalize">{myApplication.status}</Badge>
                            {myApplication.status === "offered" && <Button><Download className="mr-2 h-4 w-4" /> Download Offer Letter</Button>}
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-4">
                             <p className="text-muted-foreground">You have not applied to this drive yet.</p>
                             <Button onClick={handleApply}>Apply Now</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

function DriveHeader({ drive, company }: { drive: Drive, company?: Company }) {
    return (
        <div>
        <Button variant="ghost" asChild className="mb-4">
            <Link href="/drives"><ArrowLeft className="mr-2 h-4 w-4"/> Back to Drives</Link>
        </Button>
        <PageHeader title={drive.title} description={company?.name} />
        <div className="mt-4 grid md:grid-cols-3 gap-4 text-sm">
            <div><span className="font-semibold text-muted-foreground">CTC: </span>{drive.ctc}</div>
            <div><span className="font-semibold text-muted-foreground">Roles: </span>{drive.roles.join(', ')}</div>
            <div><span className="font-semibold text-muted-foreground">Eligibility: </span>{drive.eligibility}</div>
        </div>
        <p className="mt-4 text-muted-foreground">{drive.description}</p>
        </div>
    )
}


export default function DriveDetailPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const [drive, setDrive] = useState<Drive | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const driveData = await api.getDriveById(params.id);
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

  return user.role === "tpo" ? (
    <TpoDriveDetailView drive={drive} company={company || undefined} />
  ) : (
    <StudentDriveDetailView drive={drive} company={company || undefined} />
  );
}
