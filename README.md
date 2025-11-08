# ZAPDOS-HACKATHON

The **ZapDose Connect ** is a modern web application built using **Next.js 14 + TypeScript**.  
It provides role-based dashboards for **Students**, **TPOs (Training & Placement Officers)**, and **HODs (Heads of Departments)**  
to manage and track campus placement activities seamlessly.

---
# 👥 Zapdos Connect — User Stories

A centralized platform for **Campus Placement Management**, connecting **Students**, **TPOs**, and **HODs**  
to streamline registration, approvals, company drives, applications, and placement tracking.

---

## 🎯 Overview

The system is designed to:
- Allow **students** to manage their profiles, apply for drives, and track their placement journey.  
- Empower **TPOs (Training & Placement Officers)** to manage companies, drives, and placement data.  
- Enable **HODs (Heads of Departments)** to oversee student approvals and department-level performance.

---

## 🧑‍🎓 Student User Story

### 👤 Role:
A **student** registered in the system and approved by their HOD, who can apply to drives and view offers.

### 🛠️ Key Actions & Backend APIs:

| Action | Description | Backend API Used |
|--------|--------------|------------------|
| **Login to the platform** | Student logs in using email and password. | `login(email, password)` |
| **Fetch student profile** | Load student’s details, education, and resume data. | `getStudentProfile(userId)` |
| **Update profile** | Add education, experience, certifications, and skills. | `updateStudentProfile(userId, profileData)` |
| **View active drives** | Browse active placement opportunities. | `getDrives()` |
| **Apply to a drive** | Submit application with resume and cover letter. | `createApplication(userId, driveId, coverLetter)` |
| **Track application status** | See live updates like *Shortlisted*, *Interviewed*, *Offered*, *Rejected*. | `getApplicationsByStudentId(userId)` |
| **View offers** | Check number of drives that resulted in offers. | Derived from `getApplicationsByStudentId()` statusUpdates |
| **Download resume or update it** | Stored in profile for use during applications. | Part of `StudentProfile` document |

### 💡 Example Flow:
1. Student logs in using the `login` API.  
2. The dashboard loads using `getStudentProfile()` and `getApplicationsByStudentId()`.  
3. Student applies to active drives via `createApplication()`.  
4. Application is inserted into `applications` collection and linked to the drive.  
5. Status updates (Applied → Shortlisted → Offered) appear dynamically.  

---

## 🧑‍💼 TPO (Training and Placement Officer) User Story

### 👤 Role:
A **TPO** manages all placement drives, oversees company collaborations, and tracks the recruitment process across departments.

### 🛠️ Key Actions & Backend APIs:

| Action | Description | Backend API Used |
|--------|--------------|------------------|
| **Login as TPO** | Authenticate using login credentials. | `login(email, password)` |
| **Create new company** | Add company details to the database. | `createCompany(companyData)` |
| **Create new drive** | Define eligibility, departments, and roles. | `createDrive(driveData)` |
| **Fetch all drives** | View all ongoing and completed drives. | `getDrives()` |
| **View all applications** | Monitor student applications per drive. | `getApplications()` / `getApplicationsByDriveId(driveId)` |
| **Check offer statistics** | Generate reports for offers per company or department. | `getOffersByCompany()` / `getOffersByDepartment()` |
| **Verify student documents** | Mark education, experience, and certification as verified. | `verifyEducationItem()` / `verifyExperienceItem()` / `verifyCertificationItem()` |
| **View unverified profiles** | Get a list of students awaiting document verification. | `getUnverifiedProfiles()` |

### 💡 Example Flow:
1. TPO logs in and accesses the dashboard.  
2. Uses `createCompany()` to add a new company.  
3. Sets up placement drives using `createDrive()`.  
4. Students apply — `applications` collection is updated.  
5. The TPO dashboard visualizes drive statistics using `getApplications()` and `getOffersByCompany()`.  
6. TPO verifies profiles via verification APIs to maintain authenticity.  

---

## 👩‍🏫 HOD (Head of Department) User Story

### 👤 Role:
A **HOD** monitors students’ academic and placement status, approves registrations, and views department-level reports.

### 🛠️ Key Actions & Backend APIs:

| Action | Description | Backend API Used |
|--------|--------------|------------------|
| **Login as HOD** | Secure login with credentials. | `login(email, password)` |
| **View students in department** | Load all student profiles under the HOD’s department. | `getStudentProfilesByDepartment(department)` |
| **Approve or reject registrations** | Validate student profiles before TPO sees them. | `approveStudent(studentId)` / `rejectStudent(studentId)` |
| **View pending approvals** | See list of students waiting for approval. | `getPendingApprovals(department)` |
| **Track placement performance** | See offers received by department students. | `getOffersByDepartment(department)` |
| **Identify top-performing students** | Compare based on CGPA and offer counts. | Derived from `getStudentProfilesByDepartment()` and applications |
| **Monitor application status trends** | Track number of students applied, shortlisted, and placed. | Uses `getApplications()` filtered by department |

### 💡 Example Flow:
1. HOD logs in to the system.  
2. Loads department students via `getStudentProfilesByDepartment()`.  
3. Reviews pending approvals using `getPendingApprovals()`.  
4. Approves or rejects profiles with `approveStudent()` or `rejectStudent()`.  
5. Reviews placement rate charts powered by `getOffersByDepartment()`.  
6. Department-level statistics (placed vs unplaced) displayed using frontend charts.  

---

## 🗂️ Data Flow Overview

```text
+-------------------+           +----------------------+           +------------------+
|     Frontend      |  --->     |       Backend        |  --->     |    MongoDB DB    |
| (Next.js + React) |           | (TypeScript APIs)    |           | (Collections)    |
+-------------------+           +----------------------+           +------------------+
         ↓                              ↓                               ↓
   StudentDashboard               getStudentProfile()           studentProfiles
   TPODashboard                   getOffersByCompany()          drives, companies
   HODDashboard                   getPendingApprovals()         applications
```
## 📈 Example System Flow
```text
Student registers → HOD approves profile → TPO verifies → Company drive created
        ↓                         ↓                        ↓
   Student applies           Application added         TPO reviews status
        ↓                         ↓                        ↓
  Offer generated ← Application updated ← Drive statistics refreshed
```

## 🚀 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js 14 (App Router)** | Server components, routing, and rendering |
| **TypeScript** | Strong typing and maintainability |
| **Tailwind CSS + shadcn/ui** | Modern, consistent UI components |
| **Lucide Icons** | Beautiful vector icons |
| **Recharts** | Interactive charts and graphs |
| **Next Auth (Custom)** | Role-based authentication |
| **MongoDB API Integration** | Real-time data from backend APIs |

---

## 🧩 Role-Based Dashboards

### 👨‍🎓 Student Dashboard
> Personalized dashboard for students to view their placement journey and active opportunities.

**Features**
- Track **applications**, **offers**, and **active drives**
- View **recent application statuses**
- Explore and apply for **available drives**
- Skeleton loaders for smooth transitions during data fetch

**Preview**
![Student Dashboard Preview](./assets/student-dashboard.png)

---

### 🧑‍💼 TPO Dashboard
> Administrative interface for managing drives, applications, and placement statistics.

**Features**
- Create and manage **placement drives**
- Track **applications** and **offers** across drives
- View **drive performance** with bar charts
- Quick actions: **Email Generator** and **Drive Creation**
- Monitor **active drives** and **placement reports**

**Charts**
- Drive-wise Applications vs Placed Students
- Offers and Active Drives Summary

**Preview**
![TPO Dashboard Preview](./assets/tpo-dashboard.png)

---

### 👩‍🏫 HOD Dashboard
> Department-level view to monitor placement activities and approve student registrations.

**Features**
- Track total **students**, **placement rate**, and **offers**
- View **Placed vs. Unplaced** charts
- Monitor **application statuses** with pie charts
- Manage **pending student approvals** efficiently

**Charts**
- Placement Overview (Bar)
- Application Status Breakdown (Pie)
xx
**Preview**
![HOD Dashboard Preview](./assets/hod-dashboard.png)

---

# 🏫 ZAPDOS Connect Backend

A **Next.js server-side backend** connected to **MongoDB** for managing authentication, student profiles, companies, placement drives, applications, verifications, and reports in a **campus placement management system**.

---

## 🚀 Overview

This backend powers the **ZAPDOS Connect Platform**, enabling seamless role-based operations for **Students**, **TPOs**, and **HODs**.

It provides CRUD APIs and business logic for:
- 🔐 User authentication  
- 🎓 Student profile management  
- 🏢 Company & drive management  
- 📝 Application tracking  
- ✅ Verification and approvals  
- 📊 Placement analytics & reporting  

Built with **Next.js (App Router)**, **TypeScript**, and **MongoDB**, using modular server-side functions for scalability and performance.

---

## 🧩 Database Schema

![Database Schema](./db.png)

---

## 🗄️ Core Collections and Their Purpose

### 🧑‍💻 `login`
Stores user authentication data and role-based access.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `name` | String | Full name of user |
| `email` | String | User email (unique) |
| `password` | String | Encrypted password |
| `role` | String | `"student"`, `"hod"`, `"tpo"`, `"admin"` |
| `department` | String | Associated department (if applicable) |
| `avatarUrl` | String | Profile image |

---

### 🏛️ `departments`
List of academic departments in the institution.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique ID |
| `name` | String | Department name (e.g. "Computer Science") |

---

### 🎓 `student_profiles`
Holds comprehensive student details, academic data, and verification status.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `studentId` | String | Unique student reference (maps to login) |
| `name` | String | Student name |
| `email` | String | Student email |
| `department` | String | Department name |
| `cgpa` | Number | Current CGPA |
| `skills` | [String] | Technical skills |
| `registrationStatus` | String | `"Pending"`, `"Approved"`, `"Rejected"` |
| `education` | [EducationItem] | Educational qualifications |
| `experience` | [ExperienceItem] | Work/internship history |
| `certifications` | [CertificationItem] | Certificates earned |
| `resumes` | [String] | Uploaded resume URLs |

---

### 📘 `education_item`
Stores student educational details.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique record ID |
| `degree` | String | e.g. “B.Tech CS” |
| `institution` | String | Name of college/university |
| `startDate` | Object | `{ month, year }` |
| `endDate` | Object | `{ month, year }` |
| `grade` | String | e.g. “A+” |
| `verified` | Boolean | Verified by TPO |

---

### 🧰 `experience_item`
Contains internship or professional experience entries.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique record ID |
| `company` | String | Company name |
| `role` | String | Position or title |
| `startDate` | Object | `{ month, year }` |
| `endDate` | Object | `{ month, year }` |
| `description` | String | Responsibilities summary |
| `verified` | Boolean | Verified by TPO |

---

### 🏅 `certification_item`
List of certifications acquired by students.

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique ID |
| `name` | String | Certificate name |
| `description` | String | About the certification |
| `issued_by` | String | Issuing authority |
| `issue_date` | Date | Date of issue |
| `expiry_date` | Date | Expiry date, if applicable |
| `verified` | Boolean | Verified by TPO |

---

### 🏢 `companies`
Stores company and recruiter information.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique company ID |
| `name` | String | Company name (unique) |
| `industryType` | String | Domain or industry |
| `email` | String | Contact email |
| `phone` | String | Contact phone number |
| `location` | String | Company base location |
| `logoUrl` | String | Company logo image |

---

### 📅 `drives`
Represents placement or internship drives created by TPOs.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique drive ID |
| `companyId` | ObjectId | Reference to `companies` |
| `title` | String | Drive title |
| `description` | String | Overview of the drive |
| `status` | String | `"active"`, `"ongoing"`, `"upcoming"`, `"completed"` |
| `roles` | [String] | Roles offered |
| `skills` | [String] | Required skills |
| `location` | String | Drive location |
| `employmentType` | String | `"Full-time"`, `"Internship"`, etc. |
| `ctc` | Object | `{ value, unit }` e.g. `{ 15, "LPA" }` |
| `minCgpa` | Number | Minimum eligibility CGPA |
| `eligibleBranches` | [String] | List of eligible departments |
| `stages` | [String] | Drive process (Applied → Interview → Offered) |
| `applications` | [String] | Student IDs who applied |

---

### 📝 `applications`
Connects students to the drives they’ve applied for.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique ID |
| `studentId` | String | Reference to `student_profiles.studentId` |
| `driveId` | String | Reference to `drives.id` |
| `statusUpdates` | [StatusUpdate] | Logs of application progress |
| `resumeUrl` | String | Submitted resume |
| `coverLetter` | String | Application cover letter |
| `appliedDate` | Date | Submission date |

---

### ⏱️ `status_update`
Tracks each application’s progression through stages.

| Field | Type | Description |
|-------|------|-------------|
| `status` | String | `"Applied"`, `"Screening"`, `"Interview"`, `"Offered"`, `"Rejected"` |
| `date` | Date | Status timestamp |

---

### ✅ `verification`
Maintains verification records for student profiles.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique ID |
| `studentId` | String | Student reference |
| `educationVerified` | Boolean | Education verified |
| `experienceVerified` | Boolean | Experience verified |
| `certificationsVerified` | Boolean | Certifications verified |
| `verifiedBy` | String | TPO’s user ID |
| `verifiedAt` | Date | Verification timestamp |

---

### 📊 `reports`
Stores system-generated placement analytics.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique ID |
| `report_type` | String | `"OffersByCompany"` or `"OffersByDepartment"` |
| `data` | Object | Aggregated statistics |
| `createdAt` | Date | Report generation time |

---

## 🔗 Relationships

```text
login.department > departments.name
student_profiles.studentId > applications.studentId
applications.driveId > drives.id
drives.companyId > companies.id
education_item.id < student_profiles.education
experience_item.id < student_profiles.experience
certification_item.id < student_profiles.certifications
verification.studentId > student_profiles.studentId
