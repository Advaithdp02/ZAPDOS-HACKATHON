import Drive from "../models/Drive.js";

// Create
export const createDrive = async (req, res) => {
  try {
    const drive = await Drive.create(req.body);
    res.status(201).json(drive);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all
export const getDrives = async (req, res) => {
  const drives = await Drive.find().populate("companyId", "name industryType logoUrl");
  res.json(drives);
};

// Get one
export const getDriveById = async (req, res) => {
  const drive = await Drive.findById(req.params.id).populate("companyId", "name");
  if (!drive) return res.status(404).json({ message: "Drive not found" });
  res.json(drive);
};

// Update
export const updateDrive = async (req, res) => {
  const drive = await Drive.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(drive);
};

// Delete
export const deleteDrive = async (req, res) => {
  await Drive.findByIdAndDelete(req.params.id);
  res.json({ message: "Drive deleted" });
};
