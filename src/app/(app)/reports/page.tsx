
"use client";

import { useAuth } from "@/hooks/use-auth";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import * as api from "@/lib/api";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Application, Company, Drive, StudentProfile } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const getCurrentStatus = (app: Application) => app.statusUpdates[app.statusUpdates.length - 1].status;

export default function ReportsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [offersByCompany, setOffersByCompany] = useState<{name: string, count: number}[]>([]);
  const [offersByDepartment, setOffersByDepartment] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<null | 'department' | 'company' | 'master'>(null);


  useEffect(() => {
    if (!user) return;
    
    const fetchData = async () => {
        try {
            const [companyOffers, departmentOffers] = await Promise.all([
                api.getOffersByCompany(),
                api.getOffersByDepartment(user.role === 'hod' ? user.department : undefined)
            ]);
            setOffersByCompany(companyOffers);
            setOffersByDepartment(departmentOffers);
        } catch (error) {
            console.error("Failed to load report data", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, [user]);

  const downloadCSV = (data: any[], filename: string) => {
    if (data.length === 0) {
        toast({
            variant: "destructive",
            title: "No Data",
            description: "There is no data available to download for this report.",
        });
        return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header])).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.href) {
      URL.revokeObjectURL(link.href);
    }
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleDepartmentReport = () => {
      setIsDownloading('department');
      downloadCSV(offersByDepartment.map(item => ({ Department: item.name, Offers: item.count })), "department_wise_report.csv");
      setIsDownloading(null);
  }
  
  const handleCompanyReport = () => {
        setIsDownloading('company');
        downloadCSV(offersByCompany.map(item => ({ Company: item.name, Offers: item.count })), "company_wise_report.csv");
        setIsDownloading(null);
  }

  const handleMasterReport = async () => {
    setIsDownloading('master');
    try {
        const [applications, students, drives, companies] = await Promise.all([
            api.getApplications(),
            api.getStudentProfilesByDepartment(),
            api.getDrives(),
            api.getCompanies(),
        ]);
        
        const studentsMap = new Map(students.map(s => [s.studentId, s]));
        const drivesMap = new Map(drives.map(d => [d.id, d]));
        const companiesMap = new Map(companies.map(c => [c.id, c]));

        const placedApplications = applications.filter(app => getCurrentStatus(app).toLowerCase() === 'offered');

        const reportData = placedApplications.map(app => {
            const student = studentsMap.get(app.studentId);
            const drive = drivesMap.get(app.driveId);
            const company = drive ? companiesMap.get(drive.companyId) : undefined;
            
            return {
                Student_Name: student?.name || 'N/A',
                Student_Email: student?.email || 'N/A',
                Department: student?.department || 'N/A',
                CGPA: student?.cgpa || 'N/A',
                Company: company?.name || 'N/A',
                Role: drive?.title || 'N/A',
                CTC: drive ? `${drive.ctc.value} ${drive.ctc.unit}` : 'N/A',
                Status: getCurrentStatus(app),
            };
        });
        
        downloadCSV(reportData, "master_placement_report.csv");

    } catch (error) {
        toast({ variant: 'destructive', title: "Download Failed", description: "Could not generate the master report." });
    } finally {
        setIsDownloading(null);
    }
  }
  

  if (!user || (user.role !== "hod" && user.role !== "tpo")) {
    notFound();
  }
  
  if (loading) {
    return (
        <div className="space-y-6">
            <PageHeader
                title="Reports & Analytics"
                description="Generate and view detailed placement reports."
            />
            <div className="grid gap-6 md:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
            <Skeleton className="h-40" />
        </div>
    );
  }


  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Analytics"
        description="Generate and view detailed placement reports."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Offers by Company</CardTitle>
            <CardDescription>Number of offers released by each company.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={offersByCompany} layout="vertical" margin={{left: 20}}>
                <CartesianGrid horizontal={false} />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                <XAxis dataKey="count" type="number" hide />
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Placements by Department</CardTitle>
            <CardDescription>Placement performance across different departments.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
              <BarChart accessibilityLayer data={offersByDepartment} margin={{left: 20, right: 20}}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Downloadable Reports</CardTitle>
          <CardDescription>
            Generate comprehensive reports in CSV format.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Department-wise Report</h3>
                    <p className="text-xs text-muted-foreground">Placement stats for each department.</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleDepartmentReport} disabled={isDownloading === 'department'}>
                    {isDownloading === 'department' ? <Loader2 className="h-4 w-4 animate-spin"/> : <Download className="h-4 w-4" />}
                </Button>
            </div>
             <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Company-wise Report</h3>
                    <p className="text-xs text-muted-foreground">Performance of each participating company.</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleCompanyReport} disabled={isDownloading === 'company'}>
                    {isDownloading === 'company' ? <Loader2 className="h-4 w-4 animate-spin"/> : <Download className="h-4 w-4" />}
                </Button>
            </div>
             <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Master Report</h3>
                    <p className="text-xs text-muted-foreground">Complete placed student data.</p>
                </div>
                <Button variant="outline" size="icon" onClick={handleMasterReport} disabled={isDownloading === 'master'}>
                    {isDownloading === 'master' ? <Loader2 className="h-4 w-4 animate-spin"/> : <Download className="h-4 w-4" />}
                </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    