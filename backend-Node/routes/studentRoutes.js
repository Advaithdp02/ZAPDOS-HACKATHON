import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

const router = express.Router();

// 🟢 CREATE Student
router.post("/", createStudent);

// 🟡 GET ALL Students
router.get("/", getAllStudents);

// 🔵 GET SINGLE Student
router.get("/:id", getStudentById);

// 🟠 UPDATE Student
router.put("/:id", updateStudent);

// 🔴 DELETE Student
router.delete("/:id", deleteStudent);

export default router;
