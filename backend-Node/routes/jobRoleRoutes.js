import express from "express";
import {
  createJobRole,
  getAllJobRoles,
  getJobRoleById,
  updateJobRole,
  deleteJobRole
} from "../controllers/jobRoleController.js";

const router = express.Router();

// 🟢 CREATE Job Role
router.post("/", createJobRole);

// 🟡 GET ALL Job Roles
router.get("/", getAllJobRoles);

// 🔵 GET Job Role by ID
router.get("/:id", getJobRoleById);

// 🟠 UPDATE Job Role
router.put("/:id", updateJobRole);

// 🔴 DELETE Job Role
router.delete("/:id", deleteJobRole);

export default router;
