import express from "express";
import {
  createHOD,
  getAllHODs,
  getHODById,
  updateHOD,
  deleteHOD
} from "../controllers/hodController.js";

const router = express.Router();

// ✅ Static routes first
router.post("/create", createHOD);
router.get("/", getAllHODs);

// 🔻 Dynamic routes after
router.get("/:id", getHODById);
router.put("/:id", updateHOD);
router.delete("/:id", deleteHOD);

export default router;
