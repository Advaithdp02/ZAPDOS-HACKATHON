import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// 🔹 Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      department: department || null,
    });

    // 🟢 Transform _id → id for frontend consistency
    res.status(201).json({
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    });
  } catch (error) {
    console.error("❌ Register Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🟢 Generate JWT
    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 🟢 Return user info with string id (no password)
    res.json({
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Get All Users (no passwords)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    // 🟢 Transform _id → id
    const formattedUsers = users.map(u => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      department: u.department,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("❌ Fetch Users Error:", error);
    res.status(500).json({ message: error.message });
  }
};
