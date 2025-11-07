// app.js
import express from "express";
import morgan from "morgan";
import cors from "cors";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import hodRoutes from "./routes/hodRoutes.js";

const app = express();

// ===== Middleware =====
app.use(express.json()); // parse JSON
app.use(morgan("dev")); // log requests
app.use(cors()); // enable CORS

// ===== Routes =====
app.use("/api/auth", authRoutes);
app.use("/api/hod", hodRoutes);

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("ZapDose Placement Management System API is running 🚀");
});

export default app;
