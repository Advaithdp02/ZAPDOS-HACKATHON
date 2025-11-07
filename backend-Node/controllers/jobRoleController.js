import JobRole from "../models/JobRole.js";
import Company from "../models/Company.js";
import Department from "../models/Department.js";
import mongoose from "mongoose";
// 🟢 CREATE JOB ROLE
export const createJobRole = async (req, res) => {
  try {
    const {
      job_role,
      job_description,
      job_location,
      job_skills,
      employment_type,
      package_lpa,
      eligible_departments,
      company,
      min_cgpa,
      backlog_allowed,
      contact_person,
      contact_email,
      contact_phone,
      drive_date,
      application_deadline,
    } = req.body;

    // Check company exists
    const existingCompany = await Company.findById(company);
    if (!existingCompany) {
      return res.status(404).json({ message: "Referenced company not found" });
    }

    // Validate each department ID
    if (!Array.isArray(eligible_departments) || eligible_departments.length === 0) {
      return res.status(400).json({ message: "At least one eligible department is required" });
    }

    for (const deptId of eligible_departments) {
      if (!mongoose.Types.ObjectId.isValid(deptId)) {
        return res.status(400).json({ message: `Invalid department ID: ${deptId}` });
      }
      const dept = await Department.findById(deptId);
      if (!dept) {
        return res.status(404).json({ message: `Department not found: ${deptId}` });
      }
    }

    // Create job role
    const job = await JobRole.create({
      job_role,
      job_description,
      job_location,
      job_skills,
      employment_type,
      package_lpa,
      eligible_departments, // ✅ array of ObjectIDs
      company,
      min_cgpa,
      backlog_allowed,
      contact_person,
      contact_email,
      contact_phone,
      drive_date,
      application_deadline,
    });

    // Add job to company's jobs[]
    existingCompany.jobs.push(job._id);
    await existingCompany.save();

    res.status(201).json({
      message: "Job role created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 GET ALL JOB ROLES
export const getAllJobRoles = async (req, res) => {
  try {
    const jobs = await JobRole.find()
      .populate("company", "company_name email phone_number")
      .populate("eligible_departments", "name code");

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET SINGLE JOB ROLE BY ID
export const getJobRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobRole.findById(id)
      .populate("company", "company_name email phone_number")
      .populate("eligible_departments", "name code");

    if (!job) return res.status(404).json({ message: "Job role not found" });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE JOB ROLE
export const updateJobRole = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await JobRole.findByIdAndUpdate(id, updates, { new: true })
      .populate("company", "company_name email phone_number")
      .populate("eligible_departments", "name code");

    if (!job) return res.status(404).json({ message: "Job role not found" });

    res.status(200).json({
      message: "Job role updated successfully",
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE JOB ROLE
export const deleteJobRole = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await JobRole.findById(id);
    if (!job) return res.status(404).json({ message: "Job role not found" });

    // Remove job reference from the Company.jobs array
    await Company.findByIdAndUpdate(job.company, { $pull: { jobs: job._id } });

    await JobRole.findByIdAndDelete(id);

    res.status(200).json({ message: "Job role deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
