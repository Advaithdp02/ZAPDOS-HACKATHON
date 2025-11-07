import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  certification_number: { type: String },
  skills_learned: [{ type: String }],
  image_url: { type: String }
}, { _id: false });

// 🟢 NEW — sub-schema for applications
const appliedJobSchema = new mongoose.Schema({
  job_role: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole", required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  applied_on: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ["Applied", "Shortlisted", "Interviewed", "Selected", "Rejected"], 
    default: "Applied"
  }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  // ===== Personal Info =====
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  date_of_birth: { type: Date },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String },
  address: { type: String },
  photo_url: { type: String },
  description: { type: String },

  // ===== Academic Info =====
  univesity_number: { type: String, required: true, unique: true },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  year_of_join: { type: Number, required: true },
  year_of_study: { type: Number, required: true },
  cgpa: { type: Number, required: true },
  backlogs: { type: Number, default: 0 },

  // ===== Login =====
  login_ref: { type: mongoose.Schema.Types.ObjectId, ref: "Login" },

  // ===== Skills & Certifications =====
  skills: [{ type: String }],
  certifications: [certificationSchema],

  // ===== Applied Jobs =====
  applied_jobs: [appliedJobSchema],  // 👈 NEW

  // ===== Placement Info =====
  placed: { type: Boolean, default: false },
  company_placed: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  job_role_placed: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole" },
  companies_offered: [{
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    job_role_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole" },
    package_lpa: { type: Number },
    offer_date: { type: Date, default: Date.now }
  }],

  // ===== TPO Verification =====
  verification: {
    personal_info: { type: Boolean, default: false },
    academic_info: { type: Boolean, default: false },
    documents: { type: Boolean, default: false },
    placement_eligibility: { type: Boolean, default: false }
  },
  approved: { type: Boolean, default: false },
  offer_letter: {
    file_url: { type: String },
    job_role: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole" },
    uploaded_at: { type: Date }
  }

}, { timestamps: true });

const Student = mongoose.model("Student", studentSchema);
export default Student;
