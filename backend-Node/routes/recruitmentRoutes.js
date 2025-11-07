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
import RecruitmentRound from "../models/RecruitmentRound.js"


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
router.get("/:roundId", authorizeRoles("TPO", "HOD", "Admin"), async (req, res) => {
  try {
    const round = await RecruitmentRound.findById(req.params.roundId)
      .populate({
        path: "job_role",
        select: "job_role company",
        populate: {
          path: "company",
          select: "company_name"
        }
      })
      .populate({
        path: "candidates.student",
        select: "first_name last_name email cgpa backlogs department_id",
        populate: {
          path: "department_id",
          select: "name code"
        }
      });

    if (!round) {
      return res.status(404).json({ message: "Recruitment round not found" });
    }

    res.status(200).json(round);
  } catch (error) {
    console.error("❌ Error fetching recruitment round:", error);
    res.status(500).json({ message: error.message });
  }
});

router.post(
  "/publish-results/:jobId",
  authorizeRoles("TPO", "HOD", "Admin"),
  publishFinalResults
);

export default router;
