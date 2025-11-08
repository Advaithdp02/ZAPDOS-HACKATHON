import express from "express";
import {
  createDrive,
  getDrives,
  getDriveById,
  updateDrive,
  deleteDrive,
} from "../controllers/driveController.js";

const router = express.Router();

// Drive Routes
router.post("/", createDrive);
router.get("/", getDrives);
router.get("/:id", getDriveById);
router.put("/:id", updateDrive);
router.delete("/:id", deleteDrive);

export default router;
