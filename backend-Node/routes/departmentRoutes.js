import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
} from "../controllers/departmentController.js";

const router = express.Router();

// 🟢 CREATE Department
router.post("/", createDepartment);

// 🟡 GET ALL Departments
router.get("/", getAllDepartments);

// 🔵 GET SINGLE Department
router.get("/:id", getDepartmentById);

// 🟠 UPDATE Department
router.put("/:id", updateDepartment);

// 🔴 DELETE Department
router.delete("/:id", deleteDepartment);

export default router;
