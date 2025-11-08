import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    hodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to HOD (User with role: 'hod')
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
