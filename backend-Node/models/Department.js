import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., CSE, ECE, ME
  code: { type: String, required: true, unique: true }, // short code like CSE, ECE
  hod: { type: mongoose.Schema.Types.ObjectId, ref: "Hod" }, // optional HOD reference
  tpo: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tpo" }], // optional TPO reference
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Department = mongoose.model("Department", departmentSchema);

export default Department;
