import mongoose from "mongoose";

const statusUpdateSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the student (User collection)
      required: true,
    },
    driveId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drive", // Reference to the drive (Drive collection)
      required: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      trim: true,
    },
    appliedDate: {
      type: Date,
      required: true,
    },
    statusUpdates: [statusUpdateSchema],
    coverLetter: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("Application", applicationSchema);

export default Application;
