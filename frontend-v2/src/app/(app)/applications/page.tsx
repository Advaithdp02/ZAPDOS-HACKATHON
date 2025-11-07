
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { notFound } from "next/navigation";
import * as api from "@/lib/api";
import type { Application, Drive, Company, ApplicationStatus } from "@/lib/types";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, CheckCircle, Circle, Briefcase, Calendar, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Combine application with its drive and company for easier use
type FullApplication = Application & {
  drive: Drive;
  company: Company;
};

const REJECTED_STATUS = "Rejected";
const OFFERED_STATUS = "Offered";


function StatusTimeline({ application }: { application: FullApplication }) {
    const statusHierarchy = application.drive.stages || [];
    const currentStatusIndex = statusHierarchy.findIndex(s => s.toLowerCase() === application.status.toLowerCase());

    const isRejected = application.status.toLowerCase().includes(REJECTED_STATUS.toLowerCase());
    
    if (isRejected) {
      // Find the stage where rejection happened, if available from notes or last known status.
      // This is a simplified logic. A real app might have a dedicated `rejectedAtStage` field.
      const lastCompletedIndex = (application.statusUpdates.length > 1) 
          ? statusHierarchy.findIndex(s => s.toLowerCase() === application.statusUpdates[application.statusUpdates.length - 2].status.toLowerCase())
          : -1;

      return (
        <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
          {statusHierarchy.slice(0, lastCompletedIndex + 2).map((status, index) => {
            const isCompleted = index < lastCompletedIndex + 1;
            return (
              <div key={status} className="flex-1 flex flex-col items-center text-center min-w-[100px]">
                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                    isCompleted ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"
                )}>
                    {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                </div>
                <div className="mt-2">
                    <p className={cn("text-sm font-medium capitalize", isCompleted ? "text-primary" : "text-destructive")}>{isCompleted ? status : 'Rejected'}</p>
                </div>
              </div>
            );
          })}
        </div>
      );
    }


    return (
        <div className="flex items-center space-x-2 md:space-x-4 overflow-x-auto pb-4">
            {statusHierarchy.map((status, index) => {
                const isCompleted = index < currentStatusIndex;
                const isActive = index === currentStatusIndex;
                const statusUpdate = application.statusUpdates.find(u => u.status.toLowerCase() === status.toLowerCase());

                return (
                    <div key={status} className="flex-1 flex flex-col items-center text-center min-w-[100px]">
                        <div className="flex items-center w-full">
                            {index > 0 && <div className={cn("flex-1 h-1", isCompleted ? "bg-primary" : "bg-border")}></div>}
                            <div className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center transition-colors shrink-0",
                                (isActive || isCompleted) ? "bg-primary text-primary-foreground" : "bg-border text-muted-foreground"
                            )}>
                                {isCompleted ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                            </div>
                            {index < statusHierarchy.length - 1 && <div className={cn("flex-1 h-1", isCompleted ? "bg-primary" : "bg-border")}></div>}
                        </div>
                        <div className="mt-2">
                            <p className={cn(
                                "text-sm font-medium capitalize",
                                (isActive || isCompleted) ? "text-primary" : "text-muted-foreground"
                            )}>{status}</p>
                            {statusUpdate && (
                                <p className="text-xs text-muted-foreground">{new Date(statusUpdate.date).toLocaleDateString()}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


export default function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<FullApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'student') {
      const fetchData = async () => {
        try {
          const [apps, drives, companies] = await Promise.all([
            api.getApplicationsByStudentId(user.id),
            api.getDrives(),
            api.getCompanies()
          ]);

          const fullApps = apps.map(app => {
            const drive = drives.find(d => d.id === app.driveId);
            const company = drive ? companies.find(c => c.id === drive.companyId) : undefined;
            return { ...app, drive, company };
          }).filter(app => app.drive && app.company) as FullApplication[];
          
          setApplications(fullApps);
        } catch (error) {
          console.error("Failed to load applications", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  if (!user || user.role !== 'student') {
    notFound();
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Applications" description="Track the status of all your job applications." />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My Applications" description="Track the status of all your job applications." />
      {applications.length > 0 ? (
        applications.map(app => (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{app.drive.title}</CardTitle>
                    <CardDescription>{app.company.name}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.coverLetter && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" /> View Cover Letter
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Your Cover Letter</DialogTitle>
                          </DialogHeader>
                          <div className="prose prose-sm dark:prose-invert max-w-none py-4 whitespace-pre-wrap">
                            {app.coverLetter}
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                    {app.status.toLowerCase() === OFFERED_STATUS.toLowerCase() && (
                      <Button><Download className="mr-2 h-4 w-4" /> Download Offer</Button>
                    )}
                    {app.status.toLowerCase().includes(REJECTED_STATUS.toLowerCase()) && (
                      <div className="px-3 py-1.5 text-sm font-semibold rounded-full bg-destructive text-destructive-foreground">Rejected</div>
                    )}
                  </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Briefcase />
                        <span>{app.drive.roles.join(', ')}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Calendar />
                        <span>Applied on {new Date(app.appliedDate).toLocaleDateString()}</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <FileText />
                        <span>{app.drive.ctc}</span>
                    </div>
               </div>
              <StatusTimeline application={app} />
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="flex flex-col items-center justify-center py-20 text-center">
            <CardContent>
                <h3 className="text-lg font-semibold">No Applications Yet</h3>
                <p className="text-muted-foreground mt-2">You haven't applied to any drives. Start exploring now!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
