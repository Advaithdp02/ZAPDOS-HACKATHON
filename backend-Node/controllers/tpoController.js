import Tpo from "../models/Tpo.js";
import Login from "../models/Login.js";

// 🟢 CREATE TPO
export const createTPO = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      photo_url,
      password
    } = req.body;

    // Check if user already exists
    const existingLogin = await Login.findOne({ email });
    if (existingLogin) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create TPO record
    const tpo = await Tpo.create({
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      photo_url
    });

    // Create corresponding Login record (password will auto-hash in pre-save hook)
    const login = await Login.create({
      email,
      password, // plain password (pre-save hook hashes it)
      role: "TPO",
      referenceId: tpo._id,
      roleModel: "TPO"
    });

    // Link Login reference to TPO
    tpo.login_ref = login._id;
    await tpo.save();

    res.status(201).json({
      message: "TPO and login created successfully",
      tpo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 GET ALL TPOs
export const getAllTPOs = async (req, res) => {
  try {
    const tpos = await Tpo.find().populate("department_id", "name");
    res.status(200).json(tpos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET SINGLE TPO BY ID
export const getTPOById = async (req, res) => {
  try {
    const tpo = await Tpo.findById(req.params.id)
    if (!tpo) return res.status(404).json({ message: "TPO not found" });
    res.status(200).json(tpo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE TPO
export const updateTPO = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tpo = await Tpo.findByIdAndUpdate(id, updates, { new: true });
    if (!tpo) return res.status(404).json({ message: "TPO not found" });

    // Update linked login email if changed
    if (updates.email && tpo.login_ref) {
      await Login.findByIdAndUpdate(tpo.login_ref, { email: updates.email });
    }

    res.status(200).json({
      message: "TPO updated successfully",
      tpo
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE TPO
export const deleteTPO = async (req, res) => {
  try {
    const { id } = req.params;
    const tpo = await Tpo.findById(id);

    if (!tpo) return res.status(404).json({ message: "TPO not found" });

    // Delete linked login if exists
    if (tpo.login_ref) {
      await Login.findByIdAndDelete(tpo.login_ref);
    }

    await Tpo.findByIdAndDelete(id);

    res.status(200).json({ message: "TPO and linked login deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
