
"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import type { StudentProfile } from "@/lib/types";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

export default function ApprovalsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [pendingApprovals, setPendingApprovals] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  useEffect(() => {
    if (user && user.role === 'hod' && user.department) {
      api.getPendingApprovals(user.department)
        .then(data => {
            // NOTE: The status property is not part of the base StudentProfile type,
            // but the mock API adds it. We cast to any to handle this.
            setPendingApprovals(data as any);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user || user.role !== "hod") {
    notFound();
  }

  const handleApprovalAction = async (student: StudentProfile, approved: boolean) => {
    const action = approved ? api.approveStudent : api.rejectStudent;
    try {
        await action(student.studentId);
        toast({
            title: `Student ${approved ? "Approved" : "Rejected"}`,
            description: `${student.name}'s registration has been ${
            approved ? "approved" : "rejected"
            }.`,
        });
        setPendingApprovals(prev => prev.filter(s => s.studentId !== student.studentId));
        handleCloseDetails();
    } catch(err) {
        toast({
            variant: "destructive",
            title: "Action Failed",
            description: `Could not ${approved ? "approve" : "reject"} the student.`,
        });
    }
  };

  const handleViewDetails = (student: StudentProfile) => {
    setSelectedStudent(student);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("");
  };


  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Approvals"
        description="Review and approve new student registrations from your department."
      />
      <Card>
        <CardHeader>
          <CardTitle>Pending Registrations</CardTitle>
          <CardDescription>
            The following students are waiting for your approval to access the
            placement portal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Skeleton className="h-8 w-full" />
                    </TableCell>
                </TableRow>
              ) : pendingApprovals.length > 0 ? (
                pendingApprovals.map((student) => (
                  <TableRow key={student.studentId}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={`https://picsum.photos/seed/${student.studentId}/40/40`} alt={student.name} />
                          <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.department}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.cgpa}</TableCell>
                    <TableCell>
                      {/* @ts-ignore */}
                      <Badge variant="secondary">{student.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(student)}
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No pending approvals.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {selectedStudent && (
         <Dialog open={!!selectedStudent} onOpenChange={handleCloseDetails}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Student Registration Details</DialogTitle>
                    <DialogDescription>Review the student's information and take action.</DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="flex items-center gap-4">
                     <Avatar className="h-20 w-20">
                      <AvatarImage src={`https://picsum.photos/seed/${selectedStudent.studentId}/80/80`} alt={selectedStudent.name} />
                      <AvatarFallback className="text-2xl">{getInitials(selectedStudent.name)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                      <p className="text-muted-foreground">{selectedStudent.email}</p>
                      <p className="text-sm text-muted-foreground">{selectedStudent.department}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="space-y-1">
                          <p className="font-medium text-muted-foreground">CGPA</p>
                          <p className="font-semibold text-lg">{selectedStudent.cgpa}</p>
                      </div>
                      <div className="space-y-1">
                           <p className="font-medium text-muted-foreground">Resume</p>
                           <Button variant="link" className="p-0 h-auto"><FileText className="mr-2 h-4 w-4" /> View Resume</Button>
                      </div>
                  </div>

                  <div className="space-y-2">
                    <p className="font-medium text-muted-foreground">Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedStudent.skills.map(skill => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                        ))}
                    </div>
                  </div>
                </div>
                <DialogFooter className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => handleApprovalAction(selectedStudent, false)}>
                        <X className="mr-2 h-4 w-4 text-red-500" /> Reject
                    </Button>
                    <Button onClick={() => handleApprovalAction(selectedStudent, true)}>
                        <Check className="mr-2 h-4 w-4" /> Approve
                    </Button>
                </DialogFooter>
            </DialogContent>
         </Dialog>
      )}

    </div>
  );
}
