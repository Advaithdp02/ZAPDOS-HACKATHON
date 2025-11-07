// app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import hodRoutes from "./routes/hodRoutes.js";
import tpoRoutes from "./routes/tpoRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js"; 
import jobRoleRoutes from "./routes/jobRoleRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import recruitmentRoutes from "./routes/recruitmentRoutes.js";
import offerLetterRoutes from "./routes/offerLetterRoutes.js";
import hodApprovalRoutes from "./routes/hodApprovalRoutes.js";

const app = express();

// ===== Middleware =====
app.use(express.json()); // parse JSON
app.use(morgan("dev")); // log requests
app.use(cors()); // enable CORS

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/hod", hodRoutes);
app.use("/api/tpo", tpoRoutes);
app.use("/api/department", departmentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoleRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/recruitments", recruitmentRoutes);
app.use("/api/offerletters", offerLetterRoutes);
app.use("/api/hod", hodApprovalRoutes);

// To serve uploaded files
app.use("/uploads", express.static("uploads"));

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("ZapDose Placement Management System API is running 🚀");
});

export default app;
