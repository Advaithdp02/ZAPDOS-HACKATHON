import express from "express";
import {
  createTPO,
  getAllTPOs,
  getTPOById,
  updateTPO,
  deleteTPO
} from "../controllers/tpoController.js";

const router = express.Router();

// 🟢 CREATE a new TPO
router.post("/", createTPO);

// 🟡 GET all TPOs
router.get("/", getAllTPOs);

// 🔵 GET a single TPO by ID
router.get("/:id", getTPOById);

// 🟠 UPDATE a TPO by ID
router.put("/:id", updateTPO);

// 🔴 DELETE a TPO by ID
router.delete("/:id", deleteTPO);

export default router;
