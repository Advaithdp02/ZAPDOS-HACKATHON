import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  uploadResume,
  enrollInDrive,
  getMyDrives,
  getMyDriveStatus,
  getOfferLetters,
  getEligibleStudents,
  getAppliedJobs
} from "../controllers/studentController.js";

import { authorizeRoles, studentProtect } from "../middleware/authMiddleware.js";
import upload from "../utils/uploadResume.js";

const router = express.Router();

/* ========================================================
   🧠 AUTHENTICATION (Signup & Login)
   ======================================================== */
// ✅ Signup handled by createStudent controller
router.post("/signup", createStudent);

// Login is handled globally in authController (no need to duplicate here)

/* ========================================================
   👤 PROFILE MANAGEMENT
   ======================================================== */

// 🟢 View own profile
router.get("/profile", studentProtect, getStudentById);

// 🟡 Update own profile (personal details, skills, etc.)
router.put("/profile", studentProtect, updateStudent);

// 🟣 Upload résumé (PDF)
router.post("/upload-resume", studentProtect, upload.single("resume"), uploadResume);

/* ========================================================
   🚀 DRIVE ENROLLMENT & TRACKING
   ======================================================== */

// 🔵 View all active drives (from JobRole model)
router.get("/active-drives", studentProtect, getMyDrives);

// 🟢 Enroll in a drive
router.post("/enroll/:jobId", studentProtect, enrollInDrive);

// 🟠 Track status of a drive (rounds, results, etc.)
router.get("/my-drives/:jobId", studentProtect, getMyDriveStatus);

/* ========================================================
   🏆 OFFER LETTERS
   ======================================================== */

// 🔴 Get final offer letter (if selected)
router.get("/my-offer", studentProtect, getOfferLetters);

/* ========================================================
   🧾 ADMIN or TPO Functions (optional)
   ======================================================== */
   router.get("/eligible/:jobId", authorizeRoles("TPO", "HOD", "Admin"), getEligibleStudents);

// Admin / TPO routes can still manage all students
router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.get("/my-applied-jobs", studentProtect, getAppliedJobs);

export default router;
