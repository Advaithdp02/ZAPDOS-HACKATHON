import Application from "../models/Application.js";
import Drive from "../models/Drive.js";
import User from "../models/User.js";

// Get all
export const getApplications = async (req, res) => {
  const apps = await Application.find()
    .populate("studentId", "name email")
    .populate("driveId", "title companyId");
  res.json(apps);
};

// Get by student
export const getApplicationsByStudent = async (req, res) => {
  const apps = await Application.find({ studentId: req.params.id }).populate("driveId", "title");
  res.json(apps);
};

// Create

export const createApplication = async (req, res) => {
  try {
    const { studentId, driveId, coverLetter } = req.body;

    console.log("📩 Incoming createApplication request:", req.body);

    // 1️⃣ Validate input
    if (!studentId || !driveId) {
      console.warn("⚠️ Missing studentId or driveId");
      return res.status(400).json({ message: "studentId and driveId are required" });
    }

    // 2️⃣ Ensure the drive exists
    const drive = await Drive.findById(driveId);
    if (!drive) {
      console.warn("⚠️ Drive not found for ID:", driveId);
      return res.status(404).json({ message: "Drive not found" });
    }

    // 3️⃣ Create new application with safe defaults
    const newApplication = new Application({
      id: `app-${Date.now()}`,
      studentId,
      driveId,
      resumeUrl: "/resumes/default.pdf",
      appliedDate: new Date(),
      status: "Applied",
      coverLetter: coverLetter || "",
      statusUpdates: [{ status: "Applied", date: new Date() }],
    });

    console.log("🛠 Creating application with data:", newApplication);

    // 4️⃣ Save to DB
    await newApplication.save();

    // 5️⃣ Update the drive’s applications array
    drive.applications.push(studentId);
    await drive.save();

    console.log("✅ Application created successfully:", newApplication._id);
    res.status(201).json(newApplication);

  } catch (error) {
    console.error("❌ Error creating application:");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    console.error("Error stack:", error.stack);
    console.error("Error details:", error);

    res.status(500).json({ message: error.message });
  }
};

