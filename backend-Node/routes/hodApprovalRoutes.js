import express from "express";
import {
  getPendingStudents,
  approveStudent,
  rejectStudent,
} from "../controllers/hodApprovalController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// HOD routes only
router.get("/pending", authorizeRoles("HOD"), getPendingStudents);
router.put("/approve/:studentId", authorizeRoles("HOD"), approveStudent);
router.delete("/reject/:studentId", authorizeRoles("HOD"), rejectStudent);

export default router;
