

import type { User, Company, Drive, Application, StudentProfile, Department } from "./types";

export const users: User[] = [
  { id: "user-tpo-1", name: "Dr. Evelyn Reed", email: "tpo@test.com", password: "password", role: "tpo", avatarUrl: "https://picsum.photos/seed/user1/100/100" },
  { id: "user-hod-1", name: "Prof. Samuel Chen", email: "hod@test.com", password: "password", role: "hod", department: "Computer Science", avatarUrl: "https://picsum.photos/seed/user2/100/100" },
  { id: "user-student-1", name: "Alice Johnson", email: "student@test.com", password: "password", role: "student", department: "Computer Science", avatarUrl: "https://picsum.photos/seed/user3/100/100" },
  { id: "user-student-2", name: "Bob Williams", email: "bob@test.com", password: "password", role: "student", department: "Computer Science", avatarUrl: "https://picsum.photos/seed/user4/100/100" },
  { id: "user-student-3", name: "Charlie Brown", email: "charlie@test.com", password: "password", role: "student", department: "Electronics" },
];

export const companies: Company[] = [
  { id: "comp-1", name: "Innovate Inc.", logoUrl: "/logos/innovate-inc.svg", industryType: "Technology", email: "hr@innovate.com", phone: "123-456-7890", location: "San Francisco, CA, USA" },
  { id: "comp-2", name: "Quantum Solutions", logoUrl: "/logos/quantum-solutions.svg", industryType: "Finance", email: "careers@quantum.com", phone: "234-567-8901", location: "New York, NY, USA" },
  { id: "comp-3", name: "Stellar Tech", logoUrl: "/logos/stellar-tech.svg", industryType: "Aerospace", email: "jobs@stellar.com", phone: "345-678-9012", location: "Austin, TX, USA" },
  { id: "comp-4", name: "Apex Dynamics", logoUrl: "/logos/apex-dynamics.svg", industryType: "Robotics", email: "apply@apexdynamics.com", phone: "456-789-0123", location: "Boston, MA, USA" },
  { id: "comp-5", name: "Helios Energy", logoUrl: "/logos/helios-energy.svg", industryType: "Energy", email: "recruitment@helios.com", phone: "567-890-1234", location: "Houston, TX, USA" },
  { id: "comp-6", name: "Nexus Robotics", logoUrl: "/logos/nexus-robotics.svg", industryType: "AI", email: "hr@nexusrobotics.com", phone: "678-901-2345", location: "Seattle, WA, USA" },
];

export const drives: Drive[] = [
  {
    id: "drive-1",
    companyId: "comp-1",
    title: "Software Engineer 2024",
    description: "Hiring talented software engineers for our core product team. Looking for strong problem-solvers with a passion for coding.",
    roles: ["Frontend Developer", "Backend Developer"],
    skills: ["React", "Node.js", "SQL", "TypeScript"],
    location: "San Francisco, CA, USA",
    employmentType: "Full-time",
    minCgpa: 7.0, 
    eligibleBranches: ["Computer Science", "Information Technology"],
    ctc: "15 LPA",
    status: "active",
    applicationDeadline: "2024-08-15T23:59:59Z",
    driveDate: "2024-09-05T09:00:00Z",
    applications: ["user-student-1", "user-student-2"],
    stages: ["Applied", "Shortlisted", "Technical Round 1", "Technical Round 2", "HR Round", "Offered"],
  },
  {
    id: "drive-2",
    companyId: "comp-2",
    title: "Data Analyst Program",
    description: "Join our analytics team to work on cutting-edge data problems and drive business insights.",
    roles: ["Data Analyst", "Business Intelligence Analyst"],
    skills: ["Python", "R", "SQL", "Tableau"],
    location: "New York, NY, USA",
    employmentType: "Full-time",
    minCgpa: 6.5, 
    eligibleBranches: ["All"],
    ctc: "12 LPA",
    status: "ongoing",
    applications: ["user-student-1"],
    stages: ["Applied", "Aptitude Test", "Group Discussion", "Interview", "Offered"],
  },
  {
    id: "drive-3",
    companyId: "comp-3",
    title: "Graduate Engineer Trainee",
    description: "A comprehensive training program for fresh graduates to become future leaders in technology.",
    roles: ["Trainee Engineer"],
    skills: ["C++", "Problem Solving"],
    location: "Austin, TX, USA",
    employmentType: "Full-time",
    minCgpa: 6.0, 
    eligibleBranches: ["Computer Science", "Electronics", "Mechanical"],
    ctc: "8 LPA",
    status: "completed",
    applications: [],
    stages: ["Applied", "Online Assessment", "Interview", "Offered"],
  },
  {
    id: "drive-4",
    companyId: "comp-4",
    title: "Product Manager Internship",
    description: "Exciting internship opportunity for aspiring product managers to work on a live product.",
    roles: ["Product Intern"],
    skills: ["Market Research", "Agile", "Communication"],
    location: "Boston, MA, USA",
    employmentType: "Internship",
    eligibleBranches: ["All"],
    ctc: "50,000/month stipend",
    status: "upcoming",
    applications: [],
    stages: ["Applied", "Case Study Submission", "Interview", "Offered"],
  },
    {
    id: "drive-5",
    companyId: "comp-5",
    title: "Mechanical Engineer",
    description: "Seeking innovative mechanical engineers to join our R&D department for renewable energy projects.",
    roles: ["Design Engineer", "Thermal Engineer"],
    skills: ["AutoCAD", "SolidWorks", "FEA"],
    location: "Houston, TX, USA",
    employmentType: "Full-time",
    minCgpa: 7.5, 
    eligibleBranches: ["Mechanical"],
    ctc: "14 LPA",
    status: "active",
    applications: [],
    stages: ["Applied", "Technical Assessment", "Core Interview", "HR Round", "Offered"],
  },
  {
    id: "drive-6",
    companyId: "comp-6",
    title: "Robotics Software Engineer",
    description: "Develop software for our next-generation autonomous robots. Strong C++ and Python skills required.",
    roles: ["Robotics Engineer", "AI/ML Engineer"],
    skills: ["C++", "Python", "ROS", "SLAM"],
    location: "Seattle, WA, USA",
    employmentType: "Full-time",
    minCgpa: 8.0, 
    eligibleBranches: ["Computer Science", "Electronics", "Mechanical"],
    ctc: "18 LPA",
    status: "active",
    applications: [],
    stages: ["Applied", "Coding Challenge", "System Design Interview", "Robotics Knowledge Test", "Final Interview", "Offered"],
  },
   {
    id: "drive-7",
    companyId: "comp-1",
    title: "Cybersecurity Analyst",
    description: "Protect our systems from cyber threats. Experience with network security and ethical hacking preferred.",
    roles: ["Security Analyst"],
    skills: ["Network Security", "Penetration Testing", "SIEM"],
    location: "Remote",
    employmentType: "Full-time",
    minCgpa: 6.0, 
    eligibleBranches: ["Computer Science", "Information Technology"],
    ctc: "13 LPA",
    status: "ongoing",
    applications: [],
    stages: ["Applied", "Screening", "Technical Interview", "Security Challenge", "HR Round", "Offered"],
  },
];

export const applications: Application[] = [
  { 
    id: "app-1", 
    studentId: "user-student-1", 
    driveId: "drive-1", 
    status: "Technical Round 1", 
    resumeUrl: "/resumes/alice-johnson.pdf", 
    appliedDate: "2024-07-15",
    statusUpdates: [
      { status: "Applied", date: "2024-07-15" },
      { status: "Shortlisted", date: "2024-07-18", notes: "Online assessment cleared." },
      { status: "Technical Round 1", date: "2024-07-22", notes: "Technical Interview Round 1 scheduled." },
    ],
    coverLetter: "I am passionate about front-end development and have been working with React for over two years. I am excited by Innovate Inc.'s mission and believe my skills align perfectly with this role."
  },
  { 
    id: "app-2", 
    studentId: "user-student-2", 
    driveId: "drive-1", 
    status: "Applied", 
    resumeUrl: "/resumes/bob-williams.pdf", 
    appliedDate: "2024-07-16",
    statusUpdates: [
      { status: "Applied", date: "2024-07-16" }
    ],
    coverLetter: "As a backend developer, I have a strong foundation in Java and building scalable systems. I am eager to contribute to Innovate Inc.'s product development."
  },
  { 
    id: "app-3", 
    studentId: "user-student-1", 
    driveId: "drive-2", 
    status: "Offered", 
    resumeUrl: "/resumes/alice-johnson.pdf", 
    appliedDate: "2024-07-10",
    statusUpdates: [
      { status: "Applied", date: "2024-07-10" },
      { status: "Aptitude Test", date: "2024-07-12" },
      { status: "Interview", date: "2024-07-15", notes: "Final HR round." },
      { status: "Offered", date: "2024-07-20", notes: "Offer letter released." },
    ],
    coverLetter: "My analytical skills and experience with data visualization tools make me a strong candidate for the Data Analyst Program at Quantum Solutions. I am excited to bring my skills to your team."
  },
];

export const departments: Department[] = ["Computer Science", "Electronics", "Mechanical", "Civil"];

export const studentProfiles: StudentProfile[] = [
    {
        studentId: "user-student-1",
        name: "Alice Johnson",
        email: "student@test.com",
        department: "Computer Science",
        cgpa: 8.5,
        resumeUrl: "/resumes/alice-johnson.pdf",
        skills: ["React", "Node.js", "Python", "SQL", "TypeScript", "Next.js"],
        education: [
            { id: "edu-1", degree: "B.Tech in Computer Science", institution: "Anytown University", startDate: "2020", endDate: "2024", grade: "8.5 CGPA", verified: true}
        ],
        experience: [
            { id: "exp-1", role: "Software Engineer Intern", company: "Innovate Inc.", startDate: "Summer", endDate: "2023", description: "Developed a new feature for their flagship product, resulting in a 10% increase in user engagement.", skillsUsed: ["React", "TypeScript", "Node.js"], verified: false }
        ],
        certifications: [
            { id: "cert-1", name: "Certified Kubernetes Application Developer", issuingOrganization: "The Linux Foundation", issueDate: "2023", credentialId: "LF-abc123", verified: true },
            { id: "cert-2", name: "Google Cloud Certified - Professional Cloud Architect", issuingOrganization: "Google Cloud", issueDate: "2024", verified: false }
        ]
    },
    {
        studentId: "user-student-2",
        name: "Bob Williams",
        email: "bob@test.com",
        department: "Computer Science",
        cgpa: 7.8,
        resumeUrl: "/resumes/bob-williams.pdf",
        skills: ["Java", "Spring Boot", "AWS", "Docker", "PostgreSQL"],
        education: [
            { id: "edu-2", degree: "B.Tech in Computer Science", institution: "Anytown University", startDate: "2020", endDate: "2024", grade: "7.8 CGPA", verified: true }
        ],
        experience: [
            { id: "exp-2", role: "Backend Developer Intern", company: "Quantum Solutions", startDate: "Summer", endDate: "2023", description: "Optimized database queries, improving API response times by 15%.", skillsUsed: ["Java", "Spring Boot", "PostgreSQL"], verified: false }
        ],
        certifications: []
    },
    {
        studentId: "user-student-3",
        name: "Charlie Brown",
        email: "charlie@test.com",
        department: "Electronics",
        cgpa: 8.1,
        resumeUrl: "/resumes/charlie-brown.pdf",
        skills: ["VHDL", "Verilog", "Embedded C", "IoT", "PCB Design"],
        education: [
            { id: "edu-3", degree: "B.E. in Electronics", institution: "Anytown University", startDate: "2020", endDate: "2024", grade: "8.1 CGPA", verified: false }
        ],
        experience: [
            { id: "exp-3", role: "IoT Intern", company: "Stellar Tech", startDate: "Summer", endDate: "2023", description: "Designed and built a prototype for a smart home device.", skillsUsed: ["Embedded C", "IoT", "PCB Design"], verified: false }
        ],
        certifications: [
             { id: "cert-3", name: "Certified Embedded Systems Professional", issuingOrganization: "EC-Council", issueDate: "2023", verified: false }
        ]
    },
];
