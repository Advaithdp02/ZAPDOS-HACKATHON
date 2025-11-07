
"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import type { Drive, Application, StudentProfile } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, Tooltip } from "recharts";
import { Button } from "../ui/button";
import Link from 'next/link';
import { PageHeader } from "../page-header";
import { PlusCircle, Briefcase, Mail, FileSearch, TrendingUp, Users } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  applications: {
    label: "Applications",
    color: "hsl(var(--primary))",
  },
  placed: {
    label: "Placed",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

export function TpoDashboard() {
  const { user } = useAuth();
  const [drives, setDrives] = useState<Drive[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [studentProfiles, setStudentProfiles] = useState<StudentProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'tpo') return;

    const fetchData = async () => {
        try {
            const [drivesData, appsData, studentsData] = await Promise.all([
                api.getDrives(),
                api.getApplications(),
                api.getStudentProfilesByDepartment(""),
            ]);
            setDrives(drivesData);
            setApplications(appsData);
            setStudentProfiles(studentsData);
        } catch (error) {
            console.error("Failed to load TPO dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user]);

  const dashboardStats = useMemo(() => {
    const totalDrives = drives.length;
    const totalOffers = applications.filter(a => a.status.toLowerCase() === 'offered').length;
    const placedStudents = new Set(applications.filter(a => a.status.toLowerCase() === 'offered').map(a => a.studentId)).size;

    const driveStats = drives.map(drive => {
        const driveApps = applications.filter(app => app.driveId === drive.id);
        return {
            name: drive.title.substring(0, 15) + (drive.title.length > 15 ? "..." : ""),
            applications: driveApps.length,
            placed: driveApps.filter(app => app.status.toLowerCase() === 'offered').length,
        }
    });

    return {
        totalDrives,
        totalOffers,
        placedStudents,
        activeDrives: drives.filter(d => d.status === 'active' || d.status === 'ongoing').length,
        totalStudents: studentProfiles.length,
        driveStats
    };
  }, [drives, applications, studentProfiles]);


  if (!user || user.role !== 'tpo') return null;

   if (loading) {
    return (
      <div className="space-y-8">
        <PageHeader title="TPO Dashboard" description="Oversee and manage all placement activities." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
            <Skeleton className="h-36" />
        </div>
        <Skeleton className="h-80" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader title="TPO Dashboard" description="Oversee and manage all placement activities." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col space-y-2">
                     <Button asChild variant="outline" size="sm" className="justify-start">
                        <Link href="/drives"><PlusCircle className="mr-2 h-4 w-4"/> Create Drive</Link>
                    </Button>
                     <Button asChild variant="outline" size="sm" className="justify-start">
                        <Link href="/tools/email-generator"><Mail className="mr-2 h-4 w-4"/> Email Generator</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Drives</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalDrives}</div>
            <p className="text-xs text-muted-foreground">{dashboardStats.activeDrives} active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students Placed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.placedStudents}</div>
            <p className="text-xs text-muted-foreground">out of {dashboardStats.totalStudents} total students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.totalOffers}</div>
            <p className="text-xs text-muted-foreground">across all drives</p>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
            <CardTitle>Drive Performance</CardTitle>
            <CardDescription>Applications and placements per drive.</CardDescription>
        </CardHeader>
        <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
                <BarChart data={dashboardStats.driveStats} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis 
                        dataKey="name" 
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="applications" fill="var(--color-applications)" radius={4} />
                    <Bar dataKey="placed" fill="var(--color-placed)" radius={4} />
                </BarChart>
            </ChartContainer>
        </CardContent>
       </Card>
    </div>
  );
}

    