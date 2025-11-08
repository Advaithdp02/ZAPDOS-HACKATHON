import express from "express";
import {
  createDepartment,
  getDepartments,
  assignHOD,
} from "../controllers/departmentController.js";

const router = express.Router();

// Department Routes
router.post("/", createDepartment);
router.get("/", getDepartments);
router.put("/:id/assign-hod", assignHOD);

export default router;
