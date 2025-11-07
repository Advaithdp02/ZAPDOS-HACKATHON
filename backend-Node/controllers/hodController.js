import Hod from "../models/Hod.js";
import Login from "../models/Login.js";
import bcrypt from "bcryptjs";

// 🟢 CREATE HOD
export const createHOD = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      department_id,
      photo_url,
      password
    } = req.body;

    // Check for existing login
    const existingLogin = await Login.findOne({ email });
    if (existingLogin) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create HOD
    const hod = await Hod.create({
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      department_id,
      photo_url
    });

    // Hash password and create Login
    
    const login = await Login.create({
      email,
      password: password,
      role: "HOD",
      referenceId: hod._id,
      roleModel: "HOD"
    });

    hod.login_ref = login._id;
    await hod.save();

    res.status(201).json({
      message: "HOD and login created successfully",
      hod
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 GET ALL HODs
export const getAllHODs = async (req, res) => {
  try {
    const hods = await Hod.find().populate("department_id", "name");
    res.status(200).json(hods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET SINGLE HOD BY ID
export const getHODById = async (req, res) => {
  try {
    const hod = await Hod.findById(req.params.id).populate("department_id", "name");
    if (!hod) return res.status(404).json({ message: "HOD not found" });
    res.status(200).json(hod);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE HOD
export const updateHOD = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const hod = await Hod.findByIdAndUpdate(id, updates, { new: true });

    if (!hod) return res.status(404).json({ message: "HOD not found" });

    // Update email in login if changed
    if (updates.email && hod.login_ref) {
      await Login.findByIdAndUpdate(hod.login_ref, { email: updates.email });
    }

    res.status(200).json({ message: "HOD updated successfully", hod });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE HOD
export const deleteHOD = async (req, res) => {
  try {
    const { id } = req.params;
    const hod = await Hod.findById(id);

    if (!hod) return res.status(404).json({ message: "HOD not found" });

    // Delete linked login if exists
    if (hod.login_ref) {
      await Login.findByIdAndDelete(hod.login_ref);
    }

    await Hod.findByIdAndDelete(id);

    res.status(200).json({ message: "HOD and linked login deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
