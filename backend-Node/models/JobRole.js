import mongoose from "mongoose";

const jobRoleSchema = new mongoose.Schema({
  job_role: { type: String, required: true }, // e.g., Software Engineer
  job_description: { type: String },
  job_location: { type: String },
  package_lpa: { type: Number },

  // Eligibility
  eligible_departments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Department" }],
  min_cgpa: { type: Number },
  backlog_allowed: { type: Boolean, default: false },

  // Contact person info specific to this job
  contact_person: { type: String },
  contact_email: { type: String },
  contact_phone: { type: String },

  drive_date: { type: Date },
  application_deadline: { type: Date }

}, { timestamps: true });

const JobRole = mongoose.model("JobRole", jobRoleSchema);

export default JobRole;
