import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getOfferLetters
} from "../controllers/studentController.js";
import { studentProtect } from "../middleware/authMiddleware.js";
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



router.get("/my-offer", studentProtect, getOfferLetters);



export default router;
