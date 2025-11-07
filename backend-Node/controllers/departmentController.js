import Department from "../models/Department.js";
import Hod from "../models/Hod.js";
import Tpo from "../models/Tpo.js";

// 🟢 CREATE DEPARTMENT
export const createDepartment = async (req, res) => {
  try {
    const { name, code, hod, tpo } = req.body;

    // Check if department already exists
    const existing = await Department.findOne({ $or: [{ name }, { code }] });
    if (existing) {
      return res.status(400).json({ message: "Department name or code already exists" });
    }

    const department = await Department.create({
      name,
      code,
      hod: hod || null,
      tpo: tpo || []
    });

    res.status(201).json({
      message: "Department created successfully",
      department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 GET ALL DEPARTMENTS
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find()
      .populate("hod", "first_name last_name email");
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET SINGLE DEPARTMENT BY ID
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById(id)
      .populate("hod", "first_name last_name email")
      .populate("tpo", "first_name last_name email");

    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.status(200).json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE DEPARTMENT
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    updates.updated_at = new Date();

    const department = await Department.findByIdAndUpdate(id, updates, {
      new: true
    })
      .populate("hod", "first_name last_name email")
      .populate("tpo", "first_name last_name email");

    if (!department)
      return res.status(404).json({ message: "Department not found" });

    res.status(200).json({
      message: "Department updated successfully",
      department
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE DEPARTMENT
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const department = await Department.findById(id);
    if (!department)
      return res.status(404).json({ message: "Department not found" });

    await Department.findByIdAndDelete(id);

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
