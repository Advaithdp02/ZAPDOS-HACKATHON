import mongoose from "mongoose";

const hodSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  date_of_birth: { type: Date },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String },
  department_id: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
  photo_url: { type: String },

  // Optional reference to Login document
  login_ref: { type: mongoose.Schema.Types.ObjectId, ref: "Login" }

}, { timestamps: true });

const Hod = mongoose.model("Hod", hodSchema);

export default Hod;
