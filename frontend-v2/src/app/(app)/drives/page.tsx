
"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import type { Drive, Company, StudentProfile, Application, CreateDrive } from "@/lib/types";
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, ArrowRight, Search, CheckSquare, MapPin, Sparkles, Loader2, Calendar as CalendarIcon, ChevronsUpDown } from "lucide-react";
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
import { useState, useEffect, useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { getHirability } from "@/ai/flows/get-hirability-score";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formState, setFormState] = useState({
      companyId: "",
      title: "",
      description: "",
      ctc: "",
      roles: "",
      skills: "",
      location: "",
      employmentType: "Full-time" as Drive['employmentType'],
      minCgpa: "",
      allowedBacklogs: "",
      applicationDeadline: undefined as Date | undefined,
      driveDate: undefined as Date | undefined,
      eligibleBranches: "",
      stages: "Applied, Screening, Interview, HR Round, Offered",
  });

  const fetchData = async () => {
    setLoading(true);
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
    if (!formState.companyId || !formState.title) {
        toast({ variant: "destructive", title: "Missing Fields", description: "Company and Drive Title are required." });
        return;
    }
    
    try {
        const newDriveData: CreateDrive = {
            companyId: formState.companyId,
            title: formState.title,
            description: formState.description,
            ctc: formState.ctc,
            roles: formState.roles.split(',').map(r => r.trim()),
            skills: formState.skills.split(',').map(s => s.trim()),
            location: formState.location,
            employmentType: formState.employmentType,
            minCgpa: formState.minCgpa ? parseFloat(formState.minCgpa) : undefined,
            allowedBacklogs: formState.allowedBacklogs ? parseInt(formState.allowedBacklogs) : undefined,
            eligibleBranches: formState.eligibleBranches.split(',').map(b => b.trim()),
            applicationDeadline: formState.applicationDeadline?.toISOString(),
            driveDate: formState.driveDate?.toISOString(),
            stages: formState.stages.split(',').map(s => s.trim()),
        };
        
        await api.createDrive(newDriveData);
        toast({ title: "Drive Created", description: `${formState.title} has been successfully created.` });
        fetchData();
        setIsDialogOpen(false);
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
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Create Drive
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Drive</DialogTitle>
              <DialogDescription>
                Fill in the details for the new placement drive.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="company">Company</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !formState.companyId && "text-muted-foreground"
                      )}
                    >
                      {formState.companyId
                        ? companies.find((c) => c.id === formState.companyId)?.name
                        : "Select company"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0">
                    <Command>
                      <CommandInput placeholder="Search company..." />
                      <CommandEmpty>No company found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {companies.map((company) => (
                            <CommandItem
                              key={company.id}
                              value={company.name}
                              onSelect={() => {
                                setFormState(prev => ({...prev, companyId: company.id, location: company.location}));
                              }}
                            >
                              {company.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Drive Title</Label>
                <Input id="title" value={formState.title} onChange={e => setFormState(prev => ({...prev, title: e.target.value}))} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={formState.location} onChange={e => setFormState(prev => ({...prev, location: e.target.value}))} />
              </div>

              <div className="col-span-2 space-y-2">
                <Label htmlFor="description">Job Description</Label>
                <Textarea id="description" value={formState.description} onChange={e => setFormState(prev => ({...prev, description: e.target.value}))} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="roles">Job Roles</Label>
                <Input id="roles" placeholder="Comma-separated" value={formState.roles} onChange={e => setFormState(prev => ({...prev, roles: e.target.value}))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skills">Required Skills</Label>
                <Input id="skills" placeholder="Comma-separated" value={formState.skills} onChange={e => setFormState(prev => ({...prev, skills: e.target.value}))} />
              </div>

               <div className="space-y-2">
                <Label htmlFor="ctc">CTC</Label>
                <Input id="ctc" value={formState.ctc} onChange={e => setFormState(prev => ({...prev, ctc: e.target.value}))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employmentType">Employment Type</Label>
                 <Select value={formState.employmentType} onValueChange={(value) => setFormState(prev => ({...prev, employmentType: value as any}))}>
                    <SelectTrigger id="employmentType">
                        <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                </Select>
              </div>
              
              <div className="col-span-2 space-y-2">
                <Label htmlFor="stages">Drive Stages</Label>
                <Input id="stages" placeholder="Comma-separated, e.g., Applied, Screening, HR Round" value={formState.stages} onChange={e => setFormState(prev => ({...prev, stages: e.target.value}))} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minCgpa">Minimum CGPA</Label>
                <Input id="minCgpa" type="number" value={formState.minCgpa} onChange={e => setFormState(prev => ({...prev, minCgpa: e.target.value}))} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="allowedBacklogs">Allowed Backlogs</Label>
                <Input id="allowedBacklogs" type="number" value={formState.allowedBacklogs} onChange={e => setFormState(prev => ({...prev, allowedBacklogs: e.target.value}))} />
              </div>

               <div className="col-span-2 space-y-2">
                <Label htmlFor="eligibleBranches">Eligible Branches</Label>
                <Input id="eligibleBranches" placeholder="Comma-separated" value={formState.eligibleBranches} onChange={e => setFormState(prev => ({...prev, eligibleBranches: e.target.value}))} />
              </div>

              <div className="space-y-2">
                <Label>Application Deadline</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !formState.applicationDeadline && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formState.applicationDeadline ? format(formState.applicationDeadline, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={formState.applicationDeadline}
                        onSelect={(date) => setFormState(prev => ({...prev, applicationDeadline: date}))}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
              </div>
               <div className="space-y-2">
                <Label>Drive Date</Label>
                 <Popover>
                    <PopoverTrigger asChild>
                        <Button
                        variant={"outline"}
                        className={cn(
                            "w-full justify-start text-left font-normal",
                            !formState.driveDate && "text-muted-foreground"
                        )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formState.driveDate ? format(formState.driveDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                        mode="single"
                        selected={formState.driveDate}
                        onSelect={(date) => setFormState(prev => ({...prev, driveDate: date}))}
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
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


function DriveCard({ drive, company, studentProfile, hasApplied }: { drive: Drive, company?: Company, studentProfile: StudentProfile | null, hasApplied: boolean }) {
    const { toast } = useToast();
    const [hirability, setHirability] = useState<{score: number, reasoning: string} | null>(null);
    const [isLoadingScore, setIsLoadingScore] = useState(false);

    const handleCheckFit = async () => {
        if (!studentProfile) return;
        setIsLoadingScore(true);
        try {
            const result = await getHirability({ drive, student: studentProfile });
            setHirability({ score: result.hirability, reasoning: result.reasoning });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Analysis Failed",
                description: "Could not calculate your hirability score."
            });
        } finally {
            setIsLoadingScore(false);
        }
    }

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{drive.title}</CardTitle>
                        <CardDescription>{company?.name}</CardDescription>
                    </div>
                     {hasApplied && <Badge variant="secondary"><CheckSquare className="mr-1 h-3 w-3" />Applied</Badge>}
                </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{drive.description}</p>
                 <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline">CTC: {drive.ctc}</Badge>
                    {company && <Badge variant="outline" className="flex items-center"><MapPin className="mr-1 h-3 w-3" /> {company.location}</Badge>}
                </div>
                
                {hirability !== null ? (
                    <div className="space-y-2 pt-2">
                        <Label className="text-xs text-muted-foreground">Your Hirability Score</Label>
                        <Progress value={hirability.score} />
                        <p className="text-xs text-muted-foreground italic">"{hirability.reasoning}"</p>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" className="w-full" onClick={handleCheckFit} disabled={isLoadingScore}>
                        {isLoadingScore ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Sparkles className="mr-2 h-4 w-4" />}
                        {isLoadingScore ? "Analyzing..." : "Check My Fit"}
                    </Button>
                )}
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href={`/drives/${drive.id}`}>View Details <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

function StudentDrivesView() {
    const { user } = useAuth();
    const [allDrives, setAllDrives] = useState<Drive[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
    const [studentApplications, setStudentApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLocations, setSelectedLocations] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                const [drivesData, companiesData, profileData, applicationsData] = await Promise.all([
                    api.getDrives(),
                    api.getCompanies(),
                    api.getStudentProfile(user.id),
                    api.getApplicationsByStudentId(user.id),
                ]);
                setAllDrives(drivesData.filter(d => d.status === 'active' || d.status === 'ongoing'));
                setCompanies(companiesData);
                setStudentProfile(profileData || null);
                setStudentApplications(applicationsData);
            } catch (error) {
                toast({ variant: "destructive", title: "Failed to load data" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [toast, user]);
    
    const getCompany = (companyId: string) => {
        return companies.find((c) => c.id === companyId);
    }
    
    const allLocations = useMemo(() => {
        const locations = new Set(companies.map(c => c.location));
        return Array.from(locations);
    }, [companies]);

    const handleLocationFilterChange = (location: string, checked: boolean) => {
        const newSelection = new Set(selectedLocations);
        if(checked) {
            newSelection.add(location);
        } else {
            newSelection.delete(location);
        }
        setSelectedLocations(newSelection);
    }

    const filteredDrives = useMemo(() => {
        return allDrives.filter(drive => {
            const company = getCompany(drive.companyId);
            const searchTermMatch = drive.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                    company?.name.toLowerCase().includes(searchTerm.toLowerCase());
            
            const locationMatch = selectedLocations.size === 0 || (company && selectedLocations.has(company.location));

            return searchTermMatch && locationMatch;
        });
    }, [allDrives, companies, searchTerm, selectedLocations]);

    const studentAppliedDriveIds = useMemo(() => {
        return new Set(studentApplications.map(app => app.driveId));
    }, [studentApplications]);


    return (
        <div className="space-y-6">
            <PageHeader title="Available Drives" description="Explore and apply to the latest placement opportunities." />
            
             <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Search by title or company..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            <MapPin className="mr-2 h-4 w-4"/>
                            Filter by Location
                            {selectedLocations.size > 0 && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{selectedLocations.size}</span>}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Locations</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {allLocations.map(location => (
                             <DropdownMenuCheckboxItem
                                key={location}
                                checked={selectedLocations.has(location)}
                                onCheckedChange={(checked) => handleLocationFilterChange(location, !!checked)}
                             >
                                {location}
                             </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
             </div>

             {loading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                    <Skeleton className="h-72" />
                </div>
             ) : (
                filteredDrives.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredDrives.map(drive => (
                            <DriveCard 
                                key={drive.id}
                                drive={drive}
                                company={getCompany(drive.companyId)}
                                studentProfile={studentProfile}
                                hasApplied={studentAppliedDriveIds.has(drive.id)}
                            />
                        ))}
                    </div>
                ) : (
                     <Card className="flex flex-col items-center justify-center py-20 text-center col-span-full">
                        <CardContent>
                            <h3 className="text-lg font-semibold">No Drives Found</h3>
                            <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria.</p>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    )
}

export default function DrivesPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return user.role === "tpo" ? <TpoDrivesView /> : <StudentDrivesView />;
}

    
