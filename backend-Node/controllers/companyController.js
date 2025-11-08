import Company from "../models/Company.js";

// Create
export const createCompany = async (req, res) => {
  try {
    const newCompany = await Company.create(req.body);
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all
export const getCompanies = async (req, res) => {
  const companies = await Company.find();
  res.json(companies);
};

// Get by ID
export const getCompanyById = async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (!company) return res.status(404).json({ message: "Company not found" });
  res.json(company);
};

// Update
export const updateCompany = async (req, res) => {
  const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(company);
};

// Delete
export const deleteCompany = async (req, res) => {
  await Company.findByIdAndDelete(req.params.id);
  res.json({ message: "Company deleted" });
};
