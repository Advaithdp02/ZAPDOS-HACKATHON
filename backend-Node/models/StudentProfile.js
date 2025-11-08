import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    grade: { type: String },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String },
    skillsUsed: { type: [String], default: [] },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    issuingOrganization: { type: String, required: true },
    issueDate: { type: String, required: true },
    credentialId: { type: String, default: null },
    verified: { type: Boolean, default: false },
  },
  { _id: false }
);

const studentProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to User (role: student)
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    cgpa: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    resumeUrl: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    education: [educationSchema],
    experience: [experienceSchema],
    certifications: [certificationSchema],
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);

export default StudentProfile;
