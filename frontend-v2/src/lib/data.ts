// This file is now used just to provide the data shape for the seeder.
// The actual data is seeded into the database in seed-db.ts.

import type { User, Company, Drive, Application, StudentProfile, Department } from "./types";

export const users: Omit<User, 'id'>[] = [
  {
    name: "TPO Officer",
    email: "tpo@test.com",
    password: "password",
    role: "tpo",
    avatarUrl: "/avatars/tpo.png",
  },
  {
    name: "Dr. Sharma",
    email: "hod@test.com",
    password: "password",
    role: "hod",
    department: "Computer Science",
    avatarUrl: "/avatars/hod.png",
  },
  {
    name: "Alice Johnson",
    email: "student@test.com",
    password: "password",
    role: "student",
    department: "Computer Science",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
   {
    name: "Bob Williams",
    email: "bob@test.com",
    password: "password",
    role: "student",
    department: "Computer Science",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export const companies: Omit<Company, 'id'>[] = [
  {
    name: "Innovate Inc.",
    logoUrl: "/logos/innovate.svg",
    industryType: "Technology",
    email: "hr@innovate.com",
    phone: "123-456-7890",
    location: "San Francisco, CA",
  },
  {
    name: "Data Dynamics",
    logoUrl: "/logos/data-dynamics.svg",
    industryType: "Data Analytics",
    email: "careers@datadynamics.com",
    phone: "234-567-8901",
    location: "New York, NY",
  },
  {
    name: "Quantum Solutions",
    logoUrl: "/logos/quantum.svg",
    industryType: "Consulting",
    email: "recruitment@quantum.com",
    phone: "345-678-9012",
    location: "Chicago, IL",
  },
];

export const drives: Omit<Drive, 'id'>[] = [
  {
    companyId: "comp1",
    title: "Software Engineer 2024",
    description: "Seeking talented software engineers to join our dynamic team. You will work on cutting-edge projects and contribute to the development of our flagship products.",
    roles: ["Frontend Developer", "Backend Developer"],
    skills: ["React", "Node.js", "MongoDB"],
    location: "San Francisco, CA",
    employmentType: "Full-time",
    minCgpa: 8.0,
    allowedBacklogs: 0,
    eligibleBranches: ["Computer Science", "Electronics"],
    ctc: "15 LPA",
    status: "active",
    applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
    driveDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    applications: ["student1", "student2"],
    stages: ["Applied", "Screening", "Technical Round 1", "Technical Round 2", "HR Round", "Offered"]
  },
  {
    companyId: "comp2",
    title: "Data Analyst Internship",
    description: "An exciting internship opportunity for aspiring data analysts. You will work with our data science team to analyze large datasets and generate valuable insights.",
    roles: ["Data Analyst Intern"],
    skills: ["Python", "SQL", "Tableau"],
    location: "New York, NY",
    employmentType: "Internship",
    minCgpa: 7.5,
    allowedBacklogs: 1,
    eligibleBranches: ["Computer Science", "Mechanical"],
    ctc: "50,000/month stipend",
    status: "active",
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
    applications: ["student1"],
    stages: ["Applied", "Aptitude Test", "Interview", "Offered"]
  },
  {
    companyId: "comp3",
    title: "Business Consultant",
    description: "Join our consulting team to help clients solve their most complex business challenges. Strong analytical and communication skills are required.",
    roles: ["Junior Consultant"],
    skills: ["Communication", "Problem Solving", "MS Excel"],
    location: "Chicago, IL",
    employmentType: "Full-time",
    minCgpa: 7.0,
    eligibleBranches: ["Computer Science", "Electronics", "Mechanical", "Civil"],
    ctc: "12 LPA",
    status: "upcoming",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    driveDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    applications: [],
    stages: ["Applied", "Case Study", "Partner Round", "Offered"]
  },
];

export const studentProfiles: StudentProfile[] = [
  {
    studentId: "student1",
    name: "Alice Johnson",
    email: "student@test.com",
    department: "Computer Science",
    cgpa: 8.5,
    resumeUrl: "/resumes/alice.pdf",
    skills: ["React", "TypeScript", "Node.js", "Python"],
    education: [
      { id: 'edu1', degree: "B.Tech in Computer Science", institution: "State University", startDate: "2020", endDate: "2024", grade: "8.5 CGPA", verified: true },
    ],
    experience: [
      { id: 'exp1', role: "Web Dev Intern", company: "Tech Solutions", startDate: "Jun 2023", endDate: "Aug 2023", description: "Developed a new feature for the company's main web application.", skillsUsed: ["React", "CSS"], verified: true },
    ],
    certifications: [
      { id: 'cert1', name: "Certified Kubernetes Application Developer", issuingOrganization: "The Linux Foundation", issueDate: "2023", verified: false }
    ],
    registrationStatus: "Approved"
  },
   {
    studentId: "student2",
    name: "Bob Williams",
    email: "bob@test.com",
    department: "Computer Science",
    cgpa: 7.8,
    resumeUrl: "/resumes/bob.pdf",
    skills: ["Java", "Spring Boot", "SQL"],
    education: [
      { id: 'edu2', degree: "B.Tech in Computer Science", institution: "State University", startDate: "2020", endDate: "2024", grade: "7.8 CGPA", verified: false },
    ],
    experience: [],
    certifications: [],
    registrationStatus: "Pending"
  },
];

export const applications: Omit<Application, 'id'>[] = [
  {
    studentId: "student1",
    driveId: "drive1",
    statusUpdates: [
      { status: "Applied", date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Screening", date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Technical Round 1", date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    resumeUrl: "/resumes/alice.pdf",
    appliedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    coverLetter: "I am very interested in the Software Engineer position at Innovate Inc."
  },
  {
    studentId: "student1",
    driveId: "drive2",
    statusUpdates: [
      { status: "Applied", date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Aptitude Test", date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Interview", date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
      { status: "Offered", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    resumeUrl: "/resumes/alice.pdf",
    appliedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    studentId: "student2",
    driveId: "drive1",
    statusUpdates: [
      { status: "Applied", date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    ],
    resumeUrl: "/resumes/bob.pdf",
    appliedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
];


export const departments: Department[] = ["Computer Science", "Electronics", "Mechanical", "Civil"];