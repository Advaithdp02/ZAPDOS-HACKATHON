import mongoose from "mongoose";

const tpoSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  date_of_birth: { type: Date },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String },

  // If a TPO is associated with a specific department
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  photo_url: { type: String },

  // Optional reference to Login document
  login_ref: { type: mongoose.Schema.Types.ObjectId, ref: "Login" }

}, { timestamps: true });

const Tpo = mongoose.model("Tpo", tpoSchema);

export default Tpo;
