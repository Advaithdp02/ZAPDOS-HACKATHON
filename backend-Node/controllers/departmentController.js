import Department from "../models/Department.js";

// Create
export const createDepartment = async (req, res) => {
  const dept = await Department.create(req.body);
  res.status(201).json(dept);
};

// Get all
export const getDepartments = async (req, res) => {
  const depts = await Department.find().populate("hodId", "name email");
  res.json(depts);
};

// Assign HOD
export const assignHOD = async (req, res) => {
  const dept = await Department.findByIdAndUpdate(req.params.id, { hodId: req.body.hodId }, { new: true });
  res.json(dept);
};
