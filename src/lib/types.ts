

export type UserRole = "student" | "hod" | "tpo";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
};

export type Company = {
  id: string;
  name: string;
  logoUrl: string;
  industryType: string;
  email: string;
  phone: string;
  location: string;
};

export type Ctc = {
  value: number;
  unit: string;
};

export type Drive = {
  id:string;
  companyId: string;
  title: string;
  description: string;
  roles: string[];
  skills: string[];
  location: string;
  employmentType: "Full-time" | "Internship" | "Part-time";
  minCgpa?: number;
  allowedBacklogs?: number;
  eligibleBranches: string[];
  ctc: Ctc;
  status: "active" | "ongoing" | "completed" | "upcoming";
  applicationDeadline?: string;
  driveDate?: string;
  applications: string[]; // array of student ids
  stages: string[];
};

export type CreateDrive = Omit<Drive, 'id' | 'status' | 'applications'>;

export type ApplicationStatus = string;

export type StatusUpdate = {
  status: ApplicationStatus;
  date: string;
  notes?: string;
};

export type Application = {
  id: string;
  studentId: string;
  driveId: string;
  statusUpdates: StatusUpdate[];
  resumeUrl: string;
  appliedDate: string;
  coverLetter?: string;
};

export type DateField = {
    month: number;
    year: number;
};

export type EducationItem = {
  id: string;
  degree: string;
  institution: string;
  startDate: DateField;
  endDate: DateField | 'Present';
  grade: string;
  verified?: boolean;
};

export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  startDate: DateField;
  endDate: DateField | 'Present';
  description: string;
  skillsUsed?: string[];
  verified?: boolean;
};

export type CertificationItem = {
    id: string;
    name: string;
    issuingOrganization: string;
    issueDate: DateField;
    credentialId?: string;
    verified?: boolean;
};

export type ResumeItem = {
  id: string;
  name: string;
  dataUri: string;
  type: 'uploaded' | 'generated';
  createdAt: string;
}

export type StudentProfile = {
  studentId: string;
  name: string;
  email: string;
  department: string;
  cgpa: number;
  photoDataUri?: string;
  resumes: ResumeItem[];
  skills: string[];
  education: EducationItem[];
  experience: ExperienceItem[];
  certifications: CertificationItem[];
  registrationStatus?: "Pending" | "Approved" | "Rejected";
};

export type Department = "Computer Science" | "Electronics" | "Mechanical" | "Civil";
    
    