"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell } from "recharts";
import { PageHeader } from "../page-header";
import { Badge } from "../ui/badge";
import Link from 'next/link';
import { Button } from "../ui/button";
import { useEffect, useState, useMemo } from "react";
import type { StudentProfile, Application } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";


const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];


export function HodDashboard() {
  const { user } = useAuth();
  const [departmentStudents, setDepartmentStudents] = useState<StudentProfile[]>([]);
  const [departmentApplications, setDepartmentApplications] = useState<Application[]>([]);
  const [unapprovedStudents, setUnapprovedStudents] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'hod' && user.department) {
      const fetchData = async () => {
        try {
          const [students, apps, unapproved] = await Promise.all([
            api.getStudentProfilesByDepartment(user.department!),
            // This is inefficient. A real backend would have a better query.
            api.getApplications().then(allApps => {
                const studentIdsInDept = departmentStudents.map(s => s.studentId);
                return allApps.filter(app => studentIdsInDept.includes(app.studentId));
            }),
            api.getPendingApprovals(user.department!)
          ]);
          setDepartmentStudents(students);
          setDepartmentApplications(apps);
          setUnapprovedStudents(unapproved as any); // API adds a status field
        } catch (error) {
          console.error("Failed to load HOD dashboard data", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user, departmentStudents]);
  
  const dashboardStats = useMemo(() => {
    const offers = departmentApplications.filter((a) => a.status === "offered");
    const placedStudentIds = new Set(offers.map(o => o.studentId));
    const placedCount = placedStudentIds.size;
    const unplacedCount = departmentStudents.length - placedCount;
    const placementRate = departmentStudents.length > 0 ? ((placedCount / departmentStudents.length) * 100).toFixed(1) : 0;
    
    const placementData = [
      { name: "Placed", value: placedCount, fill: "hsl(var(--accent))" },
      { name: "Unplaced", value: unplacedCount, fill: "hsl(var(--muted))" },
    ];

    const applicationStatusData = departmentApplications.reduce((acc, app) => {
      const status = app.status.charAt(0).toUpperCase() + app.status.slice(1);
      const existing = acc.find(item => item.name === status);
      if(existing) {
          existing.value += 1;
      } else {
          acc.push({ name: status, value: 1 });
      }
      return acc;
    }, [] as {name: string, value: number}[]);

    return {
        totalStudents: departmentStudents.length,
        totalOffers: offers.length,
        placedCount,
        placementRate,
        placementData,
        applicationStatusData
    }

  }, [departmentStudents, departmentApplications]);

  if (!user || user.role !== "hod") return null;

  if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader
          title={`${user.department} Dashboard`}
          description="Monitor placement statistics and manage student approvals for your department."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={`${user.department} Dashboard`}
        description="Monitor placement statistics and manage student approvals for your department."
      />
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{dashboardStats.totalStudents}</div>
             <p className="text-xs text-muted-foreground">Registered from your department</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Placement Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{dashboardStats.placementRate}%</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.placedCount} out of {dashboardStats.totalStudents} students placed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{dashboardStats.totalOffers}</div>
            <p className="text-xs text-muted-foreground">Offers received by students</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Placement Overview</CardTitle>
                <CardDescription>Placed vs. Unplaced students in {user.department}</CardDescription>
            </CardHeader>
            <CardContent>
                 <ChartContainer config={{}} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={dashboardStats.placementData} layout="vertical" margin={{ left: 10 }}>
                        <CartesianGrid horizontal={false} />
                        <YAxis type="category" dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                        <XAxis type="number" dataKey="value" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                        <Bar dataKey="value" radius={5}>
                             {dashboardStats.placementData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Breakdown of all applications from your department.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
                 <ChartContainer config={{}} className="min-h-[200px] w-full aspect-square">
                    <PieChart>
                         <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <Pie data={dashboardStats.applicationStatusData} dataKey="value" nameKey="name" innerRadius={50}>
                             {dashboardStats.applicationStatusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Pending Approvals</CardTitle>
                <CardDescription>Review and approve new student sign-ups from your department.</CardDescription>
            </div>
            <Button asChild>
                <Link href="/approvals">View All</Link>
            </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>CGPA</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unapprovedStudents.length > 0 ? unapprovedStudents.slice(0, 2).map(student => (
                    <TableRow key={student.studentId}>
                        <TableCell>{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.cgpa}</TableCell>
                        <TableCell>
                            {/* @ts-ignore */}
                            <Badge variant="secondary">{student.status}</Badge>
                        </TableCell>
                    </TableRow>
                 )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center">No pending approvals.</TableCell>
                    </TableRow>
                 )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
