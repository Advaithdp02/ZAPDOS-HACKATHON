import mongoose from "mongoose";

const candidateStatusSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Interviewed", "Selected", "Rejected"],
    default: "Applied",
  },
  remarks: { type: String }
});

const recruitmentRoundSchema = new mongoose.Schema({
  job_role: { type: mongoose.Schema.Types.ObjectId, ref: "JobRole", required: true },
  round_name: { type: String, required: true }, // e.g. "Technical Interview"
  round_date: { type: Date, required: true },
  conducted_by: { type: String }, // e.g., "HR Team"
  candidates: [candidateStatusSchema], // each student and their status
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "Login" },
  published: { type: Boolean, default: false }

}, { timestamps: true });

const RecruitmentRound = mongoose.model("RecruitmentRound", recruitmentRoundSchema);

export default RecruitmentRound;
