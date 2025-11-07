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
import Login from "./models/Login.js";

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



///Developement route
app.post("/register/admin", async (req, res) => { try { const { email, password } = req.body; if (!email || !password) return res.status(400).json({ message: "Email and password are required" }); const existingUser = await Login.findOne({ email }); if (existingUser) return res.status(400).json({ message: "User already exists" }); const admin = await Login.create({ email, password, role: "Admin" }); res.status(201).json({ message: "Admin registered successfully", admin }); } catch (err) { res.status(500).json({ message: err.message }); } });

// To serve uploaded files
app.use("/uploads", express.static("uploads"));

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("ZapDose Placement Management System API is running 🚀");
});

export default app;
