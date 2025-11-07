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
import { Download } from "lucide-react";
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

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function ReportsPage() {
  const { user } = useAuth();
  const [offersByCompany, setOffersByCompany] = useState<{name: string, count: number}[]>([]);
  const [offersByDepartment, setOffersByDepartment] = useState<{name: string, count: number}[]>([]);
  const [loading, setLoading] = useState(true);

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
            Generate comprehensive reports in Excel or PDF format.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Department-wise Report</h3>
                    <p className="text-xs text-muted-foreground">Placement stats for each department.</p>
                </div>
                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
             <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Company-wise Report</h3>
                    <p className="text-xs text-muted-foreground">Performance of each participating company.</p>
                </div>
                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
             <div className="p-4 border rounded-lg flex items-center justify-between">
                <div>
                    <h3 className="font-semibold">Master Report</h3>
                    <p className="text-xs text-muted-foreground">Complete placement data for the year.</p>
                </div>
                <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
