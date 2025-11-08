import express from "express";
import {
  getOffersByCompany,
  getOffersByDepartment,
} from "../controllers/reportController.js";

const router = express.Router();

// 📊 Reports
router.get("/offers/company", getOffersByCompany);
router.get("/offers/department", getOffersByDepartment);

export default router;
