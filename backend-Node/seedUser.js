import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User.js";

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const users = [
  { name: "Dr. Evelyn Reed", email: "tpo@test.com", password: await bcrypt.hash("password", 10), role: "tpo" },
  { name: "Prof. Samuel Chen", email: "hod@test.com", password: await bcrypt.hash("password", 10), role: "hod", department: "Computer Science" },
  { name: "Alice Johnson", email: "student@test.com", password: await bcrypt.hash("password", 10), role: "student", department: "Computer Science" },
];

await User.deleteMany();
await User.insertMany(users);
console.log("✅ Users seeded successfully");
process.exit();
