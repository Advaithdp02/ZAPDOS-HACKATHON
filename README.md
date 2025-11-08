# ZAPDOS-HACKATHON

The **ZapDose Connect Frontend** is a modern web application built using **Next.js 14 + TypeScript**.  
It provides role-based dashboards for **Students**, **TPOs (Training & Placement Officers)**, and **HODs (Heads of Departments)**  
to manage and track campus placement activities seamlessly.

---

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

**Preview**
![HOD Dashboard Preview](./assets/hod-dashboard.png)

---

# 🏫 ZAPDOS Connect Backend

A **Next.js server-side backend** that connects to a **MongoDB database** for managing users, companies, student profiles, recruitment drives, applications, and reports in a **campus recruitment system**.

---

## 🚀 Overview

This backend handles all CRUD operations and business logic for **Campus Connect**, including:

- **User Authentication**
- **Student Profile Management**
- **Company & Drive Management**
- **Application Tracking**
- **Verification & Approval Workflows**
- **Reports and Analytics**

Built using **TypeScript**, **MongoDB**, and **Next.js server actions**, it provides clean modular APIs to interact with MongoDB collections securely.

---
## 🧩 Database Schema

![Database Schema](./db.png)

---

## ⚙️ Technologies Used

| Technology | Purpose |
|-------------|----------|
| **Next.js (App Router)** | Server-side rendering & caching |
| **TypeScript** | Strong typing and maintainability |
| **MongoDB** | Database for users, drives, and profiles |
| **MongoDB Driver** | For connecting and performing queries |
| **Next.js Cache (revalidatePath)** | To refresh pages when data changes |

---

## 🧩 Collections Used

### `users`
Stores authentication data and basic user info.

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | Unique identifier |
| `email` | String | User email |
| `password` | String | User password (plaintext in this version — should be hashed) |
| `role` | String | e.g. "student", "tpo", "hod" |

---

### `studentProfiles`
Holds detailed student information.

| Field | Type | Description |
|-------|------|-------------|
| `studentId` | String | Unique student identifier |
| `email` | String | Student’s registered email |
| `department` | String | Department name |
| `education` | Array | List of education records (each with `verified` flag) |
| `experience` | Array | Work or internship history |
| `certifications` | Array | Certifications and achievements |
| `resumeUrl` | String | Link to uploaded resume |
| `registrationStatus` | String | Pending / Approved / Rejected |

---

### `companies`
Stores company details for campus drives.

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Company name |
| `logoUrl` | String | Path to logo |
| `industry` | String | Industry type |
| `description` | String | About the company |

---

### `drives`
Represents placement or internship drives.

| Field | Type | Description |
|-------|------|-------------|
| `companyId` | ObjectId | Reference to `companies` |
| `title` | String | Drive name |
| `stages` | Array | Recruitment stages |
| `applications` | Array | List of student IDs |
| `status` | String | Active / Closed |

---

### `applications`
Links students to drives they have applied for.

| Field | Type | Description |
|-------|------|-------------|
| `studentId` | String | Reference to student profile |
| `driveId` | String | Reference to drive |
| `statusUpdates` | Array | Tracks status across stages |
| `resumeUrl` | String | Resume of the applicant |
| `coverLetter` | String | Cover letter text |
| `appliedDate` | Date | When the student applied |

---

## 🔑 API Overview

### 👤 **User API**
| Function | Description |
|-----------|--------------|
| `login(email, password)` | Authenticates user credentials |

---

### 🧾 **Student Profile API**
| Function | Description |
|-----------|--------------|
| `getStudentProfile(userId)` | Retrieves student profile by user ID |
| `getStudentProfileByStudentId(studentId)` | Fetch profile via student ID |
| `updateStudentProfile(userId, data)` | Updates profile fields |
| `getStudentProfilesByDepartment(department)` | Get all students by department |

---

### ✅ **Approvals API**
| Function | Description |
|-----------|--------------|
| `getPendingApprovals(department)` | Fetch students awaiting approval |
| `approveStudent(studentId)` | Mark a student as approved |
| `rejectStudent(studentId)` | Mark a student as rejected |

---

### 🏢 **Company API**
| Function | Description |
|-----------|--------------|
| `getCompanies()` | Fetch all companies |
| `getCompanyById(id)` | Fetch single company |
| `createCompany(data)` | Add a new company |

---

### 💼 **Drive API**
| Function | Description |
|-----------|--------------|
| `getDrives()` | Get all drives |
| `getDriveById(id)` | Get drive details |
| `createDrive(data)` | Create new drive entry |

---

### 📝 **Application API**
| Function | Description |
|-----------|--------------|
| `getApplications()` | Fetch all applications |
| `getApplicationsByStudentId(userId)` | Applications for a specific student |
| `getApplicationsByDriveId(driveId)` | Applications under a drive |
| `createApplication(userId, driveId, coverLetter)` | Submit new application |

---

### 📊 **Reports API**
| Function | Description |
|-----------|--------------|
| `getOffersByCompany()` | Count of offers per company |
| `getOffersByDepartment(department?)` | Count of offers per department |

---

### 🕵️ **Verification API**
| Function | Description |
|-----------|--------------|
| `getUnverifiedProfiles(department?)` | Find profiles needing verification |
| `verifyEducationItem(studentId, itemId)` | Mark an education item verified |
| `verifyExperienceItem(studentId, itemId)` | Mark an experience item verified |
| `verifyCertificationItem(studentId, itemId)` | Mark a certification verified |

---

## 🧮 Helper Functions

| Function | Description |
|-----------|--------------|
| `getCollection(name)` | Connects to MongoDB and returns the specified collection |
| `fromMongo(doc)` | Converts `_id` → `id` string format |
| `revalidatePath(path)` | Revalidates Next.js cached pages when data changes |

---

## 🔒 Notes & Recommendations

- Passwords should be **hashed** using `bcrypt` before storage.
- Always use **ObjectId validation** before database operations.
- Use **environment variables** for DB credentials.
- Add **authentication middleware** for secure API access.

---


