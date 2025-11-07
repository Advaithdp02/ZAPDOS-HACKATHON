import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  company_name: { type: String, required: true, unique: true },
  industry_type: { type: String },
  email: { type: String },
  phone_number: { type: String },
  website: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },

  // List of JobRole references
  jobs: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobRole" }]

}, { timestamps: true });

const Company = mongoose.model("Company", companySchema);

export default Company;
