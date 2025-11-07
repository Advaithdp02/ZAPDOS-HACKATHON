import Company from "../models/Company.js";

// 🟢 CREATE COMPANY
export const createCompany = async (req, res) => {
  try {
    const {
      company_name,
      industry_type,
      email,
      phone_number,
      website,
      address,
      city,
      state,
      country,
      jobs
    } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ company_name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company with this name already exists" });
    }

    const company = await Company.create({
      company_name,
      industry_type,
      email,
      phone_number,
      website,
      address,
      city,
      state,
      country,
      jobs: jobs || []
    });

    res.status(201).json({
      message: "Company created successfully",
      company
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 GET ALL COMPANIES
export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("jobs", "role_name salary package");
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET COMPANY BY ID
export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findById(id).populate("jobs", "role_name salary package");

    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE COMPANY
export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const company = await Company.findByIdAndUpdate(id, updates, { new: true })
      .populate("jobs", "role_name salary package");

    if (!company) return res.status(404).json({ message: "Company not found" });

    res.status(200).json({
      message: "Company updated successfully",
      company
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE COMPANY
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) return res.status(404).json({ message: "Company not found" });

    await Company.findByIdAndDelete(id);

    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
