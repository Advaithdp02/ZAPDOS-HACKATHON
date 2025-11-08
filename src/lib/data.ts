

// This file is now used just to provide the data shape for the seeder.
// The actual data is seeded into the database in seed-db.ts.

import type { User, Company, Drive, Application, StudentProfile, Department } from "./types";

export const departments: Department[] = ["Computer Science", "Electronics", "Mechanical", "Civil"];

export const users: Omit<User, 'id'>[] = [
  // Core Roles
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
  // Students
  // Computer Science (10)
  { name: "Alice Johnson", email: "student-cs-1@test.com", password: "password", role: "student", department: "Computer Science", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Bob Williams", email: "student-cs-2@test.com", password: "password", role: "student", department: "Computer Science", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Charlie Brown", email: "student-cs-3@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "Diana Miller", email: "student-cs-4@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "Ethan Davis", email: "student-cs-5@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "Fiona Garcia", email: "student-cs-6@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "George Rodriguez", email: "student-cs-7@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "Hannah Wilson", email: "student-cs-8@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "Ian Martinez", email: "student-cs-9@test.com", password: "password", role: "student", department: "Computer Science" },
  { name: "Jane Anderson", email: "student-cs-10@test.com", password: "password", role: "student", department: "Computer Science" },
  // Electronics (10)
  { name: "Kevin Thomas", email: "student-el-1@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Laura Taylor", email: "student-el-2@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Mason Moore", email: "student-el-3@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Nora Jackson", email: "student-el-4@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Oscar White", email: "student-el-5@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Penny Harris", email: "student-el-6@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Quincy Martin", email: "student-el-7@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Rachel Thompson", email: "student-el-8@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Sam Clark", email: "student-el-9@test.com", password: "password", role: "student", department: "Electronics" },
  { name: "Tina Lewis", email: "student-el-10@test.com", password: "password", role: "student", department: "Electronics" },
  // Mechanical (10)
  { name: "Ursula Robinson", email: "student-mech-1@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Victor Young", email: "student-mech-2@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Wendy Walker", email: "student-mech-3@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Xavier Hall", email: "student-mech-4@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Yara Allen", email: "student-mech-5@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Zane Hernandez", email: "student-mech-6@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Ava King", email: "student-mech-7@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Ben Wright", email: "student-mech-8@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "Chloe Lopez", email: "student-mech-9@test.com", password: "password", role: "student", department: "Mechanical" },
  { name: "David Hill", email: "student-mech-10@test.com", password: "password", role: "student", department: "Mechanical" },
  // Civil (10)
  { name: "Emily Scott", email: "student-civil-1@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Frank Green", email: "student-civil-2@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Grace Adams", email: "student-civil-3@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Henry Baker", email: "student-civil-4@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Ivy Nelson", email: "student-civil-5@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Jack Carter", email: "student-civil-6@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Kate Mitchell", email: "student-civil-7@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Leo Perez", email: "student-civil-8@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Mia Roberts", email: "student-civil-9@test.com", password: "password", role: "student", department: "Civil" },
  { name: "Noah Turner", email: "student-civil-10@test.com", password: "password", role: "student", department: "Civil" },
];

export const companies: Omit<Company, 'id' | 'logoUrl'>[] = [
    { name: "Innovate Inc.", industryType: "Technology", email: "hr@innovate.com", phone: "123-456-7890", location: "San Francisco, CA" },
    { name: "Build-It Corp.", industryType: "Construction", email: "careers@buildit.com", phone: "234-567-8901", location: "New York, NY" },
    { name: "Quantum Solutions", industryType: "R&D", email: "info@quantum.dev", phone: "345-678-9012", location: "Austin, TX" },
    { name: "Momentum Machines", industryType: "Manufacturing", email: "jobs@momentum.com", phone: "456-789-0123", location: "Chicago, IL" },
    { name: "Future Systems", industryType: "AI & Robotics", email: "recruit@futuresystems.ai", phone: "567-890-1234", location: "Boston, MA" },
];

export const studentProfiles: Omit<StudentProfile, 'id'>[] = [
  // Computer Science (10) - 2 placed
  { studentId: 'student1', name: 'Alice Johnson', email: 'student-cs-1@test.com', department: 'Computer Science', cgpa: 8.8, skills: ['React', 'Node.js', 'MongoDB'], education: [{ id: 'edu1', degree: 'B.Tech CS', institution: 'State University', startDate: { month: 8, year: 2020 }, endDate: { month: 5, year: 2024 }, grade: 'A' }], experience: [{ id: 'exp1', role: 'Intern', company: 'Innovate Inc.', startDate: { month: 6, year: 2023 }, endDate: { month: 8, year: 2023 }, description: 'Worked on the frontend.' }], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student2', name: 'Bob Williams', email: 'student-cs-2@test.com', department: 'Computer Science', cgpa: 9.1, skills: ['Python', 'Django', 'PostgreSQL'], education: [{ id: 'edu2', degree: 'B.Tech CS', institution: 'State University', startDate: { month: 8, year: 2020 }, endDate: { month: 5, year: 2024 }, grade: 'A+' }], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student3', name: 'Charlie Brown', email: 'student-cs-3@test.com', department: 'Computer Science', cgpa: 7.5, skills: ['Java', 'Spring'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student4', name: 'Diana Miller', email: 'student-cs-4@test.com', department: 'Computer Science', cgpa: 8.2, skills: ['C#', '.NET'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student5', name: 'Ethan Davis', email: 'student-cs-5@test.com', department: 'Computer Science', cgpa: 8.5, skills: ['Go', 'Docker'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student6', name: 'Fiona Garcia', email: 'student-cs-6@test.com', department: 'Computer Science', cgpa: 7.8, skills: ['PHP', 'Laravel'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Pending" },
  { studentId: 'student7', name: 'George Rodriguez', email: 'student-cs-7@test.com', department: 'Computer Science', cgpa: 9.5, skills: ['Rust', 'WebAssembly'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student8', name: 'Hannah Wilson', email: 'student-cs-8@test.com', department: 'Computer Science', cgpa: 8.1, skills: ['Swift', 'iOS'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student9', name: 'Ian Martinez', email: 'student-cs-9@test.com', department: 'Computer Science', cgpa: 7.9, skills: ['Kotlin', 'Android'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student10', name: 'Jane Anderson', email: 'student-cs-10@test.com', department: 'Computer Science', cgpa: 8.4, skills: ['TypeScript', 'Vue.js'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },

  // Electronics (10) - 2 placed
  { studentId: 'student11', name: 'Kevin Thomas', email: 'student-el-1@test.com', department: 'Electronics', cgpa: 8.5, skills: ['VHDL', 'Verilog', 'FPGA'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student12', name: 'Laura Taylor', email: 'student-el-2@test.com', department: 'Electronics', cgpa: 8.9, skills: ['Embedded C', 'RTOS'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student13', name: 'Mason Moore', email: 'student-el-3@test.com', department: 'Electronics', cgpa: 7.8, skills: ['PCB Design', 'Altium'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student14', name: 'Nora Jackson', email: 'student-el-4@test.com', department: 'Electronics', cgpa: 8.1, skills: ['Signal Processing', 'MATLAB'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student15', name: 'Oscar White', email: 'student-el-5@test.com', department: 'Electronics', cgpa: 8.3, skills: ['Control Systems'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student16', name: 'Penny Harris', email: 'student-el-6@test.com', department: 'Electronics', cgpa: 7.9, skills: ['IoT', 'Wireless Communication'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student17', name: 'Quincy Martin', email: 'student-el-7@test.com', department: 'Electronics', cgpa: 9.2, skills: ['VLSI', 'Cadence'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student18', name: 'Rachel Thompson', email: 'student-el-8@test.com', department: 'Electronics', cgpa: 8.0, skills: ['ARM Architecture'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student19', name: 'Sam Clark', email: 'student-el-9@test.com', department: 'Electronics', cgpa: 7.7, skills: ['Power Electronics'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student20', name: 'Tina Lewis', email: 'student-el-10@test.com', department: 'Electronics', cgpa: 8.6, skills: ['Robotics', 'ROS'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },

  // Mechanical (10) - 2 placed
  { studentId: 'student21', name: 'Ursula Robinson', email: 'student-mech-1@test.com', department: 'Mechanical', cgpa: 8.7, skills: ['SolidWorks', 'FEA'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student22', name: 'Victor Young', email: 'student-mech-2@test.com', department: 'Mechanical', cgpa: 9.0, skills: ['AutoCAD', 'CFD'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student23', name: 'Wendy Walker', email: 'student-mech-3@test.com', department: 'Mechanical', cgpa: 7.6, skills: ['Thermodynamics'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student24', name: 'Xavier Hall', email: 'student-mech-4@test.com', department: 'Mechanical', cgpa: 8.2, skills: ['Manufacturing Processes'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student25', name: 'Yara Allen', email: 'student-mech-5@test.com', department: 'Mechanical', cgpa: 8.5, skills: ['Robotics'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student26', name: 'Zane Hernandez', email: 'student-mech-6@test.com', department: 'Mechanical', cgpa: 7.8, skills: ['HVAC'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student27', name: 'Ava King', email: 'student-mech-7@test.com', department: 'Mechanical', cgpa: 9.3, skills: ['3D Printing'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student28', name: 'Ben Wright', email: 'student-mech-8@test.com', department: 'Mechanical', cgpa: 8.1, skills: ['Materials Science'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student29', name: 'Chloe Lopez', email: 'student-mech-9@test.com', department: 'Mechanical', cgpa: 7.9, skills: ['Mechatronics'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student30', name: 'David Hill', email: 'student-mech-10@test.com', department: 'Mechanical', cgpa: 8.4, skills: ['Product Design'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  
  // Civil (10) - 2 placed
  { studentId: 'student31', name: 'Emily Scott', email: 'student-civil-1@test.com', department: 'Civil', cgpa: 8.8, skills: ['AutoCAD Civil 3D', 'Structural Analysis'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student32', name: 'Frank Green', email: 'student-civil-2@test.com', department: 'Civil', cgpa: 9.2, skills: ['GIS', 'Project Management'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student33', name: 'Grace Adams', email: 'student-civil-3@test.com', department: 'Civil', cgpa: 7.7, skills: ['Surveying'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student34', name: 'Henry Baker', email: 'student-civil-4@test.com', department: 'Civil', cgpa: 8.3, skills: ['Geotechnical Engineering'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student35', name: 'Ivy Nelson', email: 'student-civil-5@test.com', department: 'Civil', cgpa: 8.6, skills: ['Transportation Engineering'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student36', name: 'Jack Carter', email: 'student-civil-6@test.com', department: 'Civil', cgpa: 7.9, skills: ['Environmental Engineering'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student37', name: 'Kate Mitchell', email: 'student-civil-7@test.com', department: 'Civil', cgpa: 9.1, skills: ['STAAD Pro'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student38', name: 'Leo Perez', email: 'student-civil-8@test.com', department: 'Civil', cgpa: 8.0, skills: ['Construction Management'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student39', name: 'Mia Roberts', email: 'student-civil-9@test.com', department: 'Civil', cgpa: 7.8, skills: ['Water Resources'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
  { studentId: 'student40', name: 'Noah Turner', email: 'student-civil-10@test.com', department: 'Civil', cgpa: 8.5, skills: ['Building Materials'], education: [], experience: [], certifications: [], resumes: [], registrationStatus: "Approved" },
];

export const drives: Omit<Drive, 'id' | 'applications'>[] = [
  { companyId: 'comp1', title: 'Graduate Engineer Trainee', status: 'active', description: 'Entry level software dev role.', roles: ["Frontend", "Backend"], skills: ["React", "Node.js"], location: "San Francisco, CA", employmentType: "Full-time", ctc: { value: 15, unit: 'LPA' }, minCgpa: 8, eligibleBranches: ["Computer Science"], stages: ["Applied", "Screening", "Interview", "HR Round", "Offered"]},
  { companyId: 'comp2', title: 'Civil Site Engineer', status: 'active', description: 'Oversee construction projects.', roles: ["Site Engineer"], skills: ["AutoCAD", "Project Management"], location: "New York, NY", employmentType: "Full-time", ctc: { value: 12, unit: 'LPA' }, minCgpa: 7.5, eligibleBranches: ["Civil"], stages: ["Applied", "Technical Test", "Interview", "Offered"] },
  { companyId: 'comp3', title: 'Quantum Research Intern', status: 'ongoing', description: 'Internship in quantum computing.', roles: ["Research Intern"], skills: ["Quantum Physics", "Python"], location: "Austin, TX", employmentType: "Internship", ctc: { value: 50, unit: 'K' }, minCgpa: 9, eligibleBranches: ["Computer Science", "Electronics"], stages: ["Applied", "Screening", "Interview", "Offered"] },
  { companyId: 'comp4', title: 'Mechanical Design Engineer', status: 'ongoing', description: 'Design next-gen machinery.', roles: ["Design Engineer"], skills: ["SolidWorks", "FEA"], location: "Chicago, IL", employmentType: "Full-time", ctc: { value: 14, unit: 'LPA' }, minCgpa: 8, eligibleBranches: ["Mechanical"], stages: ["Applied", "Design Test", "Interview", "Offered"] },
  { companyId: 'comp5', title: 'AI Specialist', status: 'active', description: 'Work on cutting-edge AI models.', roles: ["AI Engineer"], skills: ["PyTorch", "TensorFlow"], location: "Boston, MA", employmentType: "Full-time", ctc: { value: 20, unit: 'LPA' }, minCgpa: 8.5, eligibleBranches: ["Computer Science", "Electronics"], stages: ["Applied", "Screening", "Interview", "HR Round", "Offered"] },
  { companyId: 'comp1', title: 'Backend Developer', status: 'upcoming', description: 'Focus on server-side logic.', roles: ["Backend"], skills: ["Python", "Django"], location: "San Francisco, CA", employmentType: "Full-time", ctc: { value: 16, unit: 'LPA' }, minCgpa: 8.2, eligibleBranches: ["Computer Science"], stages: ["Applied", "Coding Round", "Interview", "Offered"] },
  { companyId: 'comp2', title: 'Structural Analyst', status: 'completed', description: 'Analyze structural integrity.', roles: ["Analyst"], skills: ["STAAD Pro"], location: "New York, NY", employmentType: "Full-time", ctc: { value: 13, unit: 'LPA' }, minCgpa: 7.8, eligibleBranches: ["Civil"], stages: ["Applied", "Technical Test", "Interview", "Offered"] },
  { companyId: 'comp3', title: 'Hardware Engineering Intern', status: 'ongoing', description: 'Design and test electronic hardware.', roles: ["Hardware Intern"], skills: ["VHDL", "PCB Design"], location: "Austin, TX", employmentType: "Internship", ctc: { value: 55, unit: 'K' }, minCgpa: 8.5, eligibleBranches: ["Electronics"], stages: ["Applied", "Screening", "Interview", "Offered"] },
  { companyId: 'comp4', title: 'Automation Engineer', status: 'active', description: 'Develop robotic systems for manufacturing.', roles: ["Automation Engineer"], skills: ["Robotics", "Control Systems"], location: "Chicago, IL", employmentType: "Full-time", ctc: { value: 15, unit: 'LPA' }, minCgpa: 8, eligibleBranches: ["Mechanical", "Electronics"], stages: ["Applied", "Technical Round", "Interview", "Offered"] },
  { companyId: 'comp5', title: 'Data Scientist', status: 'active', description: 'Analyze large datasets to extract insights.', roles: ["Data Scientist"], skills: ["Python", "R", "SQL"], location: "Boston, MA", employmentType: "Full-time", ctc: { value: 18, unit: 'LPA' }, minCgpa: 8.5, eligibleBranches: ["Computer Science"], stages: ["Applied", "Screening", "Interview", "HR Round", "Offered"] },
];

const now = new Date();
export const applications: Omit<Application, 'id'>[] = [
  // 18 Placed Students
  { studentId: 'student1', driveId: 'drive1', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Alice and I am a great fit.' },
  { studentId: 'student2', driveId: 'drive5', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Bob and I am a great fit.' },
  { studentId: 'student11', driveId: 'drive3', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Kevin and I am a great fit.' },
  { studentId: 'student12', driveId: 'drive8', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Laura and I am a great fit.' },
  { studentId: 'student21', driveId: 'drive4', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Ursula and I am a great fit.' },
  { studentId: 'student22', driveId: 'drive9', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Victor and I am a great fit.' },
  { studentId: 'student31', driveId: 'drive2', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Emily and I am a great fit.' },
  { studentId: 'student32', driveId: 'drive7', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Frank and I am a great fit.' },
  { studentId: 'student7', driveId: 'drive6', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am George and I am a great fit.' },
  { studentId: 'student8', driveId: 'drive10', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Hannah and I am a great fit.' },
  { studentId: 'student17', driveId: 'drive3', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Quincy and I am a great fit.' },
  { studentId: 'student18', driveId: 'drive8', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Rachel and I am a great fit.' },
  { studentId: 'student27', driveId: 'drive4', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Ava and I am a great fit.' },
  { studentId: 'student28', driveId: 'drive9', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Ben and I am a great fit.' },
  { studentId: 'student37', driveId: 'drive2', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Kate and I am a great fit.' },
  { studentId: 'student38', driveId: 'drive7', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Leo and I am a great fit.' },
  { studentId: 'student5', driveId: 'drive1', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Ethan and I am a great fit.' },
  { studentId: 'student15', driveId: 'drive5', statusUpdates: [{ status: 'Offered', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Oscar and I am a great fit.' },

  // Applications in intermediate stages
  { studentId: 'student3', driveId: 'drive1', statusUpdates: [{ status: 'Interview', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Charlie and I am a great fit.' },
  { studentId: 'student4', driveId: 'drive6', statusUpdates: [{ status: 'Applied', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Diana and I am applying again.' },
  { studentId: 'student13', driveId: 'drive3', statusUpdates: [{ status: 'Screening', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Mason and I am a great fit.' },
  { studentId: 'student23', driveId: 'drive4', statusUpdates: [{ status: 'Applied', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Wendy and I am a great fit.' },
  { studentId: 'student33', driveId: 'drive2', statusUpdates: [{ status: 'Technical Test', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Grace and I am a great fit.' },
  { studentId: 'student14', driveId: 'drive5', statusUpdates: [{ status: 'HR Round', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Nora and I am a great fit.' },
  { studentId: 'student24', driveId: 'drive9', statusUpdates: [{ status: 'Interview', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Xavier and I am a great fit.' },
  { studentId: 'student9', driveId: 'drive10', statusUpdates: [{ status: 'Screening', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Ian and I am a great fit.' },
  { studentId: 'student19', driveId: 'drive8', statusUpdates: [{ status: 'Interview', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Sam and I am a great fit.' },
  { studentId: 'student29', driveId: 'drive9', statusUpdates: [{ status: 'Applied', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Chloe and I am a great fit.' },
  { studentId: 'student39', driveId: 'drive7', statusUpdates: [{ status: 'Rejected', date: now.toISOString() }], resumeUrl: '', appliedDate: now.toISOString(), coverLetter: 'I am Mia and I am a great fit.' },
];

    