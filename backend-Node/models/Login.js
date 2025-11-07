
import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },

  role: {
    type: String,
    required: true,
    enum: ["HOD", "TPO", "ADMIN", "STUDENT"]
  },

  // This stores the ObjectId of the referenced user
  user_ref: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "role_ref" // dynamic reference
  },

  role_ref: {
    type: String,
    required: true,
    enum: ["Hod", "Tpo", "Admin", "Student"] // collection names
  }
}, { timestamps: true });

export default mongoose.model("Login", loginSchema);
