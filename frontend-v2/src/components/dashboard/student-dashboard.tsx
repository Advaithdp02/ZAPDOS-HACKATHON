"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import type { Application, Drive, Company } from "@/lib/types";
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
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "../page-header";
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "../ui/skeleton";

const statusVariantMap: Record<Application["status"], "default" | "secondary" | "destructive" | "outline"> = {
    applied: "secondary",
    shortlisted: "outline",
    interview: "outline",
    offered: "default",
    rejected: "destructive",
};


export function StudentDashboard() {
  const { user } = useAuth();
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
        try {
            const [apps, drivesData, companiesData] = await Promise.all([
                api.getApplicationsByStudentId(user.id),
                api.getDrives(),
                api.getCompanies()
            ]);
            setMyApplications(apps);
            setDrives(drivesData);
            setCompanies(companiesData);
        } catch (error) {
            console.error("Failed to load student dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
  }, [user]);

  const activeDrives = useMemo(() => drives.filter(d => d.status === 'active' || d.status === 'ongoing'), [drives]);
  
  const getDriveById = (id: string) => drives.find(d => d.id === id);
  const getCompanyById = (id: string) => companies.find(c => c.id === id);


  if (loading) {
    return (
        <div className="space-y-8">
            <PageHeader title={`Welcome!`} description="Here's a summary of your placement activities." />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
                <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
        </div>
    )
  }

  if (!user) return null;


  return (
    <div className="space-y-8">
      <PageHeader title={`Welcome, ${user.name}!`} description="Here's a summary of your placement activities." />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>My Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{myApplications.length}</div>
            <p className="text-xs text-muted-foreground">Total applications submitted</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Offers Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{myApplications.filter(a => a.status === 'offered').length}</div>
             <p className="text-xs text-muted-foreground">Congratulations on your success!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Drives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{activeDrives.length}</div>
            <p className="text-xs text-muted-foreground">Opportunities waiting for you</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Track the status of your recent applications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applied On</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {myApplications.slice(0, 5).map(app => {
                 const drive = getDriveById(app.driveId);
                 if (!drive) return null;
                 const company = getCompanyById(drive.companyId);
                 return (
                    <TableRow key={app.id}>
                        <TableCell>{company?.name}</TableCell>
                        <TableCell>{drive.title}</TableCell>
                        <TableCell>
                            <Badge variant={statusVariantMap[app.status]} className="capitalize">{app.status}</Badge>
                        </TableCell>
                        <TableCell>{new Date(app.appliedDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                 )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Available Drives</CardTitle>
            <CardDescription>Explore and apply to the latest placement drives.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {activeDrives.slice(0,3).map(drive => {
                const company = getCompanyById(drive.companyId);
                return (
                    <div key={drive.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold">{drive.title}</h3>
                            <p className="text-sm text-muted-foreground">{company?.name} | {drive.ctc}</p>
                        </div>
                        <Button asChild size="sm">
                            <Link href={`/drives/${drive.id}`}>View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                        </Button>
                    </div>
                )
            })}
            </div>
        </CardContent>
      </Card>

    </div>
  );
}
