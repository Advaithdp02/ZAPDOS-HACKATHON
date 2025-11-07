import express from "express";
import { authorizeRoles } from "../middleware/authMiddleware.js";

// 🟢 HOD Management (Admin-level)
import {
  createHOD,
  getAllHODs,
  getHODById,
  updateHOD,
  deleteHOD
} from "../controllers/hodController.js";

// 🟡 Student Approval (HOD-level)
import {
  getPendingStudents,
  approveStudent,
  rejectStudent
} from "../controllers/hodApprovalController.js";

// 🔵 Department Reports & Verification (HOD-level)
import {
  getDepartmentStudents,
  verifyOrEditStudent
} from "../controllers/hodController.js";

import {
  getDepartmentStats,
  generateDepartmentExcel,
  generateDepartmentPDF
} from "../controllers/hodReportController.js";

const router = express.Router();

/* ========================================================
   👑 ADMIN — HOD Management
   ======================================================== */

// Create a new HOD (Admin)
router.post("/create", authorizeRoles("Admin"), createHOD);

// Get all HODs (Admin)
router.get("/", authorizeRoles("Admin"), getAllHODs);

// Get HOD by ID (Admin)
router.get("/:id", authorizeRoles("Admin"), getHODById);

// Update HOD (Admin)
router.put("/:id", authorizeRoles("Admin"), updateHOD);

// Delete HOD (Admin)
router.delete("/:id", authorizeRoles("Admin"), deleteHOD);


/* ========================================================
   🧑‍🏫 HOD Functional Routes (Department-level Actions)
   ======================================================== */

// Get pending students in the HOD's department
router.get("/students/pending", authorizeRoles("HOD"), getPendingStudents);

// Approve a student's signup
router.put("/students/approve/:studentId", authorizeRoles("HOD"), approveStudent);

// Reject a student's signup
router.delete("/students/reject/:studentId", authorizeRoles("HOD"), rejectStudent);

// Get all department students (approved or not)
router.get("/students", authorizeRoles("HOD"), getDepartmentStudents);

// Verify or edit student profile
router.put("/students/:studentId", authorizeRoles("HOD"), verifyOrEditStudent);


/* ========================================================
   📊 Reports & Analytics (HOD)
   ======================================================== */

// View department placement stats
router.get("/stats", authorizeRoles("HOD"), getDepartmentStats);

// Generate Excel report
router.get("/report/excel", authorizeRoles("HOD"), generateDepartmentExcel);

// Generate PDF report
router.get("/report/pdf", authorizeRoles("HOD"), generateDepartmentPDF);


export default router;
