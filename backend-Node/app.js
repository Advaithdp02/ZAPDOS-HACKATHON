import express from "express";
import cors from "cors";
import morgan from "morgan";

import userRoutes from "./routes/userRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import driveRoutes from "./routes/driveRoutes.js";
import studentProfileRoutes from "./routes/studentProfileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import reportRoutes from "./routes/reportRoutes.js"



const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "http://localhost:9002", // your frontend URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Register routes
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/drives", driveRoutes);
app.use("/api/student-profiles", studentProfileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/reports", reportRoutes);



// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("ZapDose Placement Management System API is running 🚀");
});

export default app;

