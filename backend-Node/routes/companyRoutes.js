import express from "express";
import {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany
} from "../controllers/companyController.js";

const router = express.Router();

// 🟢 CREATE a Company
router.post("/", createCompany);

// 🟡 GET all Companies
router.get("/", getAllCompanies);

// 🔵 GET Company by ID
router.get("/:id", getCompanyById);

// 🟠 UPDATE Company by ID
router.put("/:id", updateCompany);

// 🔴 DELETE Company by ID
router.delete("/:id", deleteCompany);

export default router;
