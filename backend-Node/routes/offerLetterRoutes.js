import express from "express";
import upload from "../middleware/uploadOfferLetter.js";
import { uploadOfferLetter } from "../controllers/offerLetterController.js";
import { authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧑‍💼 TPO/HOD/Admin can upload offer letters
router.post(
  "/upload/:studentId/:jobId",
  authorizeRoles("TPO", "HOD", "Admin"),
  upload.single("offer_letter"), // Multer middleware
  uploadOfferLetter
);

export default router;
