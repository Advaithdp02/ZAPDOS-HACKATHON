import express from "express";
import {
  getStudentProfiles,
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  getPendingApprovals,
  getUnverifiedProfiles,
  approveStudent,
  rejectStudent,
  verifyEducationItem,
  verifyExperienceItem,
  verifyCertificationItem,
} from "../controllers/studentProfileController.js";

const router = express.Router();

// 🟢 BASIC CRUD ROUTES
router.get("/", getStudentProfiles);           // Get all profiles (optional ?department)
router.get("/:id", getStudentProfile);         // Get profile by student ID
router.post("/", createStudentProfile);        // Create new student profile
router.put("/:id", updateStudentProfile);      // Update student profile

// 🟣 APPROVAL ROUTES (HOD)
router.get("/pending/list", getPendingApprovals);   // Get students awaiting approval
router.put("/approve/:studentId", approveStudent);  // Approve student profile
router.put("/reject/:studentId", rejectStudent);    // Reject student profile

// 🟡 VERIFICATION ROUTES (Education / Experience / Certification)
router.get("/unverified/list", getUnverifiedProfiles); // Get all unverified profiles (optional ?department)
router.put("/:studentId/verify/education/:itemId", verifyEducationItem);
router.put("/:studentId/verify/experience/:itemId", verifyExperienceItem);
router.put("/:studentId/verify/certification/:itemId", verifyCertificationItem);

export default router;
