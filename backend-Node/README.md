# 🎓 Campus Placement Management System (Backend)

## 🧩 Overview
The **Campus Placement Management System** backend is built to streamline and automate the process of managing student placements, job roles, and recruitment rounds within an academic institution.  
It serves as the core API and database layer for roles like **Students**, **HODs (Heads of Departments)**, **TPOs (Training & Placement Officers)**, and **Admins**.

---

## 🗄️ Database Schema

Below is the complete database schema designed using **MongoDB** and **Mongoose**, supporting role-based access and structured data management.

![Database Schema](db.jpg)

---

### 🧱 Entities and Relationships

#### **1. login [icon: lock, color: gray]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| email | string (unique) | Login email |
| password | string | Hashed password |
| role | enum("Student", "HOD", "TPO", "Admin") | Role-based access |

---

#### **2. students [icon: user, color: blue]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| first_name, last_name | string | Student details |
| gender | enum("Male", "Female", "Other") | Gender |
| date_of_birth | date | Date of birth |
| email | string (unique) | Student email |
| phone_number | string | Contact |
| address | string | Address |
| photo_url | string | Student photo |
| description | string | Bio or summary |
| university_number | string (unique) | Roll/University number |
| department_id | objectId | Linked to department |
| year_of_join, year_of_study | number | Academic details |
| cgpa, backlogs | number | Academic metrics |
| login_ref | objectId | References login table |
| skills | [string] | Technical skills |
| certifications | [Certification] | Certifications list |
| placed | boolean | Placement status |
| company_placed | objectId | Linked company |
| job_role_placed | objectId | Linked job role |
| companies_offered | [CompanyOffer] | Offers received |
| verification | object | Verification info |
| approved | boolean | Approval status |
| offer_letter | object | Uploaded offer letter |

---

#### **3. certifications [icon: award, color: green]**
| Field | Type | Description |
|-------|------|-------------|
| name | string | Certification name |
| description | string | Certification details |
| certification_number | string | Unique identifier |
| skills_learned | [string] | Related skills |
| image_url | string | Certificate proof |

---

#### **4. hods [icon: user-tie, color: teal]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| first_name, last_name | string | HOD name |
| gender | enum("Male", "Female", "Other") | Gender |
| date_of_birth | date | DOB |
| email | string (unique) | Contact email |
| phone_number | string | Contact number |
| department_id | objectId | Linked department |
| photo_url | string | Profile photo |
| login_ref | objectId | References login |

---

#### **5. tpo [icon: user-check, color: green]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| first_name, last_name | string | TPO name |
| gender | enum("Male", "Female", "Other") | Gender |
| date_of_birth | date | DOB |
| email | string (unique) | Contact email |
| phone_number | string | Contact number |
| photo_url | string | Profile photo |
| login_ref | objectId | References login |

---

#### **6. departments [icon: university, color: blue]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| name | string (unique) | Department name |
| code | string (unique) | Department code |
| hod | objectId | Linked to HOD |

---

#### **7. companies [icon: building, color: orange]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| company_name | string (unique) | Company name |
| industry_type | string | Type of industry |
| email | string | Contact email |
| phone_number | string | Contact number |
| website | string | Website |
| address | string | Address |
| city, state, country | string | Location details |
| jobs | [objectId] | Job roles offered |

---

#### **8. job_roles [icon: briefcase, color: purple]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| job_role | string | Role title |
| job_description | string | Description |
| job_location | string | Location |
| job_skills | [string] | Required skills |
| employment_type | enum("Full-time", "Part-time", "Internship", "Contract") | Job type |
| package_lpa | number | Package offered |
| eligible_departments | [objectId] | Allowed departments |
| company | objectId | Linked company |
| min_cgpa | number | Eligibility criteria |
| backlog_allowed | boolean | Eligibility rule |
| contact_person | string | Recruiter name |
| contact_email | string | Recruiter email |
| contact_phone | string | Recruiter phone |
| drive_date | date | Drive date |
| application_deadline | date | Application deadline |

---

#### **9. recruitment_rounds [icon: calendar-check, color: purple]**
| Field | Type | Description |
|-------|------|-------------|
| id | string (pk) | Unique identifier |
| job_role | objectId | Linked job role |
| round_name | string | Round title |
| round_date | date | Date of round |
| conducted_by | string | Examiner/HR name |
| candidates | [CandidateStatus] | Student round details |
| created_by | objectId | Created by login user |
| published | boolean | Published or draft |

---

#### **10. candidate_status [icon: user-circle, color: blue]**
| Field | Type | Description |
|-------|------|-------------|
| student | objectId | Linked student |
| status | enum("Applied", "Shortlisted", "Interviewed", "Selected", "Rejected") | Current stage |
| remarks | string | Evaluation comments |


---

## ⚙️ Tech Stack

- **Node.js** + **Express.js** – REST API framework  
- **MongoDB** + **Mongoose** – Database and ORM  
- **JWT Authentication** – Secure login & role-based access  
- **bcrypt** – Password hashing  
- **dotenv** – Environment configuration  

---

# 🚦 API Routes Documentation

This document outlines all backend routes for the **Campus Placement Management System**.  
Each module includes HTTP methods, endpoints, descriptions, and access permissions.

---

## 🧩 Base URL

http://localhost:3000/api

---

## 🔐 Authentication Routes

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/auth/register` | Register a new user (Login model) | Public |
| POST | `/auth/login` | Login user and receive JWT token | Public |

---

## 🎓 Student Routes

Base Path: `/students`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/signup` | Register a new student | Public |
| GET | `/profile` | Get logged-in student profile | Student |
| PUT | `/profile` | Update own student profile | Student |
| POST | `/upload-resume` | Upload student résumé (PDF) | Student |
| GET | `/active-drives` | View all active job drives | Student |
| POST | `/enroll/:jobId` | Enroll in a specific job drive | Student |
| GET | `/my-drives/:jobId` | View drive status for a specific job | Student |
| GET | `/my-offer` | Get final offer letter details | Student |
| GET | `/eligible/:jobId` | Get eligible students for a job role | TPO / HOD / Admin |
| GET | `/` | Get all students | Admin / TPO |
| GET | `/:id` | Get a single student by ID | Admin / TPO / HOD |
| PUT | `/:id` | Update student by ID | Admin / TPO / HOD |
| DELETE | `/:id` | Delete student by ID | Admin / TPO |

---

## 🧑‍🏫 HOD Routes

Base Path: `/hods`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/` | Create a new HOD and linked login | Admin |
| GET | `/` | Get all HODs | Admin |
| GET | `/:id` | Get HOD by ID | Admin |
| PUT | `/:id` | Update HOD details | Admin |
| DELETE | `/:id` | Delete HOD and login | Admin |
| GET | `/students` | Get all students in HOD’s department | HOD |
| PUT | `/students/:studentId` | Verify or edit a student profile | HOD |
| GET | `/pending-students` | Get all unapproved students | HOD |
| PATCH | `/approve/:studentId` | Approve student registration | HOD |
| DELETE | `/reject/:studentId` | Reject and remove student | HOD |
| GET | `/report/excel` | Generate Excel report for department placements | HOD |
| GET | `/report/pdf` | Generate PDF report for department placements | HOD |
| GET | `/stats` | Get department statistics (placements, avg CGPA, etc.) | HOD |

---

## 🧑‍💼 TPO Routes

Base Path: `/tpo`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/` | Create a new TPO | Admin |
| GET | `/` | Get all TPOs | Admin |
| GET | `/:id` | Get TPO by ID | Admin |
| PUT | `/:id` | Update TPO details | Admin |
| DELETE | `/:id` | Delete TPO | Admin |

---

## 🏛️ Department Routes

Base Path: `/departments`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/` | Create a new department | Admin |
| GET | `/` | Get all departments | Admin / HOD / TPO |
| GET | `/:id` | Get department by ID | Admin / HOD / TPO |
| PUT | `/:id` | Update department | Admin |
| DELETE | `/:id` | Delete department | Admin |

---

## 🏢 Company Routes

Base Path: `/companies`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/` | Create new company | TPO / Admin |
| GET | `/` | Get all companies | Public / TPO |
| GET | `/:id` | Get company details by ID | Public / TPO |
| PUT | `/:id` | Update company details | TPO / Admin |
| DELETE | `/:id` | Delete a company | Admin |

---

## 💼 Job Role Routes

Base Path: `/jobs`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/` | Create a new job role | TPO / Admin |
| GET | `/` | Get all job roles | Public |
| GET | `/:id` | Get job role by ID | Public |
| PUT | `/:id` | Update job role | TPO / Admin |
| DELETE | `/:id` | Delete job role | TPO / Admin |

---

## 📅 Recruitment Round Routes

Base Path: `/recruitment-rounds`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/` | Create a new recruitment round | TPO |
| GET | `/job/:jobId` | Get all rounds for a specific job role | TPO / HOD |
| PATCH | `/update/:roundId/student/:studentId` | Update candidate status (shortlist / reject / select) | TPO / HOD |
| GET | `/results/:jobId` | Get final selected/rejected candidates | TPO / HOD |
| POST | `/publish/:jobId` | Publish final results and send emails | TPO |
| GET | `/student/rounds` | Get recruitment rounds a student is involved in | Student |
| GET | `/student/status/:jobId` | Get student’s overall job status | Student |

---

## 📄 Offer Letter Routes

Base Path: `/offer-letters`

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| POST | `/upload/:studentId/:jobId` | Upload offer letter PDF | TPO |
| GET | `/student/:id` | Get offer letter for a student | Student / TPO |

---

## 📊 Reports & Statistics

| Method | Endpoint | Description | Access |
|--------|-----------|-------------|--------|
| GET | `/hod/report/excel` | Generate Excel department report | HOD |
| GET | `/hod/report/pdf` | Generate PDF department report | HOD |
| GET | `/hod/stats` | Department statistics (placements, CGPA, etc.) | HOD |

---

## 🧠 Notes

- **JWT Authentication** required for all protected routes.  
- **Roles** include: `Student`, `HOD`, `TPO`, `Admin`.  
- **File uploads** handled with Multer (`upload.single('resume')`, etc.).  
- **Email notifications** use Nodemailer and template-based dynamic messages.  

---

## 🔒 Middleware

| Middleware | Description |
|-------------|-------------|
| `studentProtect` | Authenticates logged-in students using JWT |
| `authorizeRoles(...roles)` | Restricts access to specific roles (e.g., TPO, HOD, Admin) |

---
