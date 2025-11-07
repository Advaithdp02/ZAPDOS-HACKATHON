"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import type { Drive, Company } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { PageHeader } from "@/components/page-header";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


const statusVariantMap: Record<Drive["status"], "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    ongoing: "outline",
    completed: "secondary",
    upcoming: "secondary"
};


function TpoDrivesView() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // State for the dialog
  const [companyName, setCompanyName] = useState("");
  const [driveTitle, setDriveTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ctc, setCtc] = useState("");
  const [roles, setRoles] = useState("");
  const [eligibility, setEligibility] = useState("");

  const fetchData = async () => {
    try {
      const [drivesData, companiesData] = await Promise.all([
        api.getDrives(),
        api.getCompanies(),
      ]);
      setDrives(drivesData);
      setCompanies(companiesData);
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateDrive = async () => {
    try {
        // This is a simplified version. A real app would likely have a company selector.
        // For now, we find a company by name or create a mock one.
        let company = companies.find(c => c.name === companyName);
        if (!company) {
            // In a real app, you might create a new company or show an error.
            // Here, we'll just use a placeholder ID.
            company = { id: `comp-${Date.now()}`, name: companyName, logoUrl: '' };
        }

        const newDriveData = {
            companyId: company.id,
            title: driveTitle,
            description,
            ctc,
            roles: roles.split(',').map(r => r.trim()),
            eligibility,
            status: 'upcoming' as const,
        };
        
        await api.createDrive(newDriveData);
        toast({ title: "Drive Created", description: `${driveTitle} has been successfully created.` });
        fetchData(); // Re-fetch data to show the new drive
        // Close dialog - assuming dialog state is managed to close on success
    } catch (error) {
        toast({ variant: "destructive", title: "Failed to create drive" });
    }
  }

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || "Unknown Company";
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Placement Drives"
          description="Manage all ongoing and upcoming placement drives."
        />
         <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Drive
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>Create New Drive</DialogTitle>
              <DialogDescription>
                Fill in the details for the new placement drive.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input id="company" value={companyName} onChange={e => setCompanyName(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Drive Title
                </Label>
                <Input id="title" value={driveTitle} onChange={e => setDriveTitle(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ctc" className="text-right">
                  CTC
                </Label>
                <Input id="ctc" value={ctc} onChange={e => setCtc(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="roles" className="text-right">
                  Roles
                </Label>
                <Input id="roles" placeholder="Comma-separated" value={roles} onChange={e => setRoles(e.target.value)} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eligibility" className="text-right">
                  Eligibility
                </Label>
                <Input id="eligibility" value={eligibility} onChange={e => setEligibility(e.target.value)} className="col-span-3" />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreateDrive}>Create Drive</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                 <TableRow><TableCell colSpan={5}><Skeleton className="w-full h-20" /></TableCell></TableRow>
              ) : drives.map((drive) => (
                  <TableRow key={drive.id}>
                    <TableCell className="font-medium">{getCompanyName(drive.companyId)}</TableCell>
                    <TableCell>{drive.title}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariantMap[drive.status]} className="capitalize">{drive.status}</Badge>
                    </TableCell>
                    <TableCell>{drive.applications.length}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link href={`/drives/${drive.id}`}>View Details</Link></DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StudentDrivesView() {
    const [drives, setDrives] = useState<Drive[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [drivesData, companiesData] = await Promise.all([
                    api.getDrives(),
                    api.getCompanies(),
                ]);
                setDrives(drivesData.filter(d => d.status === 'active' || d.status === 'ongoing'));
                setCompanies(companiesData);
            } catch (error) {
                toast({ variant: "destructive", title: "Failed to load drives" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast]);
    
    const getCompanyName = (companyId: string) => {
        return companies.find((c) => c.id === companyId)?.name;
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Available Drives" description="Explore and apply to the latest placement opportunities." />
             {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
             ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {drives.map(drive => (
                        <Card key={drive.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{drive.title}</CardTitle>
                                <CardDescription>{getCompanyName(drive.companyId)}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground line-clamp-3">{drive.description}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <Badge variant="secondary">CTC: {drive.ctc}</Badge>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/drives/${drive.id}`}>View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

export default function DrivesPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return user.role === "tpo" ? <TpoDrivesView /> : <StudentDrivesView />;
}
