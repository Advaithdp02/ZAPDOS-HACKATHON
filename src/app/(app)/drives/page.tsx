

"use client";

import { useAuth } from "@/hooks/use-auth";
import * as api from "@/lib/api";
import type { Drive, Company, StudentProfile, Application, CreateDrive, Department } from "@/lib/types";
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
import { MoreHorizontal, PlusCircle, ArrowRight, Search, CheckSquare, MapPin, Sparkles, Loader2, Calendar as CalendarIcon, ChevronsUpDown, AlertCircle } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { departments as allDepartments } from "@/lib/data";
import { MultiSelect } from "@/components/ui/multi-select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


const statusVariantMap: Record<Drive["status"], "default" | "secondary" | "destructive" | "outline"> = {
    active: "default",
    ongoing: "outline",
    completed: "secondary",
    upcoming: "secondary"
};

const driveFormSchema = z.object({
  companyId: z.string().min(1, "Company is required."),
  title: z.string().min(3, "Drive title must be at least 3 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  ctcValue: z.coerce.number().min(1, "CTC value is required."),
  ctcUnit: z.enum(['LPA', 'K']),
  roles: z.string().min(1, "At least one role is required.").refine(val => val.split(',').filter(item => item.trim()).length > 0, { message: "At least one role is required."}),
  skills: z.string().min(1, "At least one skill is required.").refine(val => val.split(',').filter(item => item.trim()).length > 0, { message: "At least one skill is required."}),
  location: z.string().min(1, "Location is required."),
  employmentType: z.enum(["Full-time", "Internship", "Part-time"]),
  minCgpa: z.coerce.number().min(0, "CGPA must be between 0 and 10.").max(10, "CGPA must be between 0 and 10.").optional().or(z.literal('')),
  allowedBacklogs: z.coerce.number().int("Backlogs must be a whole number.").min(0, "Backlogs cannot be negative.").optional().or(z.literal('')),
  applicationDeadline: z.date().optional(),
  driveDate: z.date().optional(),
  eligibleBranches: z.array(z.string()).nonempty({ message: "At least one branch is required."}),
  stages: z.string().min(1, "At least one stage is required.").refine(val => val.split(',').filter(item => item.trim()).length > 0, { message: "At least one stage is required."}),
});

type DriveFormValues = z.infer<typeof driveFormSchema>;


function TpoDrivesView() {
  const [drives, setDrives] = useState<Drive[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const form = useForm<DriveFormValues>({
    resolver: zodResolver(driveFormSchema),
    defaultValues: {
      employmentType: "Full-time",
      stages: "Applied, Screening, Interview, HR Round, Offered",
      roles: "",
      skills: "",
      eligibleBranches: [],
      ctcUnit: "LPA",
    },
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

  const handleCreateDrive = async (values: DriveFormValues) => {
    try {
        const newDriveData: CreateDrive = {
            ...values,
            ctc: {
                value: values.ctcValue,
                unit: values.ctcUnit,
            },
            minCgpa: values.minCgpa === '' ? undefined : Number(values.minCgpa),
            allowedBacklogs: values.allowedBacklogs === '' ? undefined : Number(values.allowedBacklogs),
            roles: values.roles.split(',').map(r => r.trim()),
            skills: values.skills.split(',').map(s => s.trim()),
            stages: values.stages.split(',').map(s => s.trim()),
            applicationDeadline: values.applicationDeadline?.toISOString(),
            driveDate: values.driveDate?.toISOString(),
        };
        
        await api.createDrive(newDriveData);
        toast({ title: "Drive Created", description: `${values.title} has been successfully created.` });
        fetchData();
        setIsDialogOpen(false);
        form.reset();
    } catch (error) {
        toast({ variant: "destructive", title: "Failed to create drive" });
    }
  }

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name || "Unknown Company";
  }

  const formatCtc = (ctc: Drive['ctc']) => {
    return `${ctc.value.toLocaleString()} ${ctc.unit}`;
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
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Drive</DialogTitle>
              <DialogDescription>
                Fill in the details for the new placement drive.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateDrive)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
                  <div className="col-span-2">
                    <FormField
                        control={form.control}
                        name="companyId"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Company</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value
                                        ? companies.find(
                                            (company) => company.id === field.value
                                        )?.name
                                        : "Select company"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                <Command>
                                    <CommandInput placeholder="Search company..." />
                                    <CommandEmpty>No company found.</CommandEmpty>
                                    <CommandGroup>
                                        <CommandList>
                                        {companies.map((company) => (
                                            <CommandItem
                                            value={company.name}
                                            key={company.id}
                                            onSelect={() => {
                                                form.setValue("companyId", company.id)
                                                form.setValue("location", company.location)
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
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drive Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Graduate Engineer Trainee" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. San Francisco, CA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                            <Textarea
                                placeholder="Tell us a little bit about the job"
                                {...field}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Roles</FormLabel>
                        <FormControl>
                          <Input placeholder="Comma-separated" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Required Skills</FormLabel>
                        <FormControl>
                          <Input placeholder="Comma-separated" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-2">
                    <FormField
                      control={form.control}
                      name="ctcValue"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>CTC</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="e.g. 15" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                        control={form.control}
                        name="ctcUnit"
                        render={({ field }) => (
                        <FormItem className="col-span-1 self-end">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Unit" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="LPA">LPA</SelectItem>
                                    <SelectItem value="K">K</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select employment type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Full-time">Full-time</SelectItem>
                                <SelectItem value="Internship">Internship</SelectItem>
                                <SelectItem value="Part-time">Part-time</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-2">
                     <FormField
                        control={form.control}
                        name="stages"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Drive Stages</FormLabel>
                            <FormControl>
                            <Input placeholder="Comma-separated" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="minCgpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum CGPA</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.1" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="allowedBacklogs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Allowed Backlogs</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2">
                     <FormField
                        control={form.control}
                        name="eligibleBranches"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Eligible Branches</FormLabel>
                            <FormControl>
                               <MultiSelect
                                options={allDepartments.map(d => ({ value: d, label: d }))}
                                selected={field.value || []}
                                onChange={field.onChange}
                                className="w-full"
                                placeholder="Select eligible branches..."
                               />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>

                  <FormField
                    control={form.control}
                    name="applicationDeadline"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Application Deadline</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="driveDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Drive Date</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                )}
                                >
                                {field.value ? (
                                    format(field.value, "PPP")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />

                </div>
                 <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button type="submit">Create Drive</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardContent className="pt-6">
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
                    <TableCell>{drive.applications?.length || 0}</TableCell>
                    <TableCell className="text-right">
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
    
    const formatCtc = (ctc: Drive['ctc']) => {
        return `${ctc.value.toLocaleString()} ${ctc.unit}`;
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
                    <Badge variant="outline">CTC: {formatCtc(drive.ctc)}</Badge>
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
                setAllDrives(drivesData.filter(d => d.status === 'active' || d.status === 'ongoing' || d.status === 'upcoming'));
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


    if (loading) {
      return (
          <div className="space-y-6">
              <PageHeader title="Available Drives" description="Explore and apply to the latest placement opportunities." />
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Skeleton className="h-72" />
                  <Skeleton className="h-72" />
                  <Skeleton className="h-72" />
              </div>
          </div>
       )
    }

    if (!studentProfile || studentProfile.registrationStatus !== "Approved") {
        return (
            <div className="space-y-6">
                <PageHeader title="Available Drives" description="Explore and apply to the latest placement opportunities." />
                <Alert variant="default" className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 !text-amber-600" />
                    <AlertTitle className="text-amber-800">Account Approval Pending</AlertTitle>
                    <AlertDescription className="text-amber-700">
                        Your account is not yet approved to view or apply for placement drives. Please contact your Head of Department (HOD) for approval.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }


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

             
            {filteredDrives.length > 0 ? (
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
            )}
        </div>
    )
}

export default function DrivesPage() {
  const { user } = useAuth();
  
  if (!user) return null;

  return user.role === "tpo" ? <TpoDrivesView /> : <StudentDrivesView />;
}

    

    

