import express from "express";
import {
  createRecruitmentRound,
  getRoundsByJob,
  updateCandidateStatus,
  getFinalResults,
  getStudentRecruitmentRounds,
  getStudentJobStatus,
  publishFinalResults
} from "../controllers/recruitmentController.js";

import { authorizeRoles } from "../middleware/authMiddleware.js";
import { studentProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧑‍💼 TPO/HOD/Admin Routes
router.post("/", authorizeRoles("TPO", "HOD", "Admin"), createRecruitmentRound);
router.get("/job/:jobId", authorizeRoles("TPO", "HOD", "Admin"), getRoundsByJob);
router.put("/:roundId/student/:studentId", authorizeRoles("TPO", "HOD", "Admin"), updateCandidateStatus);
router.get("/results/:jobId", authorizeRoles("TPO", "HOD", "Admin"), getFinalResults);

// 🧑‍🎓 Student Routes
router.get("/my-rounds", studentProtect, getStudentRecruitmentRounds);
router.get("/my-status/:jobId", studentProtect, getStudentJobStatus);

router.post(
  "/publish-results/:jobId",
  authorizeRoles("TPO", "HOD", "Admin"),
  publishFinalResults
);

export default router;
