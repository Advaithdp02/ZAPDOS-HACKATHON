import express from "express";
import {
  getApplications,
  getApplicationsByStudent,
  createApplication,
} from "../controllers/applicationController.js";

const router = express.Router();

// Application Routes
router.get("/", getApplications);
router.get("/student/:id", getApplicationsByStudent);
router.post("/", createApplication);

export default router;
