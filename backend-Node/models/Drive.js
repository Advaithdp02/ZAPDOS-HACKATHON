
import mongoose from "mongoose";

const driveSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Company", // Reference to Company schema
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    roles: {
      type: [String],
      required: true,
    },
    skills: {
      type: [String],
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract"],
    },
    minCgpa: {
      type: Number,
      default: null,
    },
    eligibleBranches: {
      type: [String],
      required: true,
    },
    ctc: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "ongoing", "completed", "upcoming"],
      default: "active",
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    driveDate: {
      type: Date,
      default: null,
    },
    applications: [
      {
        type: String, // could also reference users
        ref: "User",
      },
    ],
    stages: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Drive = mongoose.model("Drive", driveSchema);

export default Drive;
