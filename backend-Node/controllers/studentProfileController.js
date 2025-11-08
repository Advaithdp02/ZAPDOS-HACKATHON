import StudentProfile from "../models/StudentProfile.js";

// 🟢 Get all student profiles (filter by department optional)
export const getStudentProfiles = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = department ? { department } : {};
    const profiles = await StudentProfile.find(filter).populate("studentId", "name email department");
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Get one student profile by ID
export const getStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await StudentProfile.findOne({ studentId: id });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Create a new student profile
export const createStudentProfile = async (req, res) => {
  try {
    const newProfile = new StudentProfile(req.body);
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🟢 Update student profile
export const updateStudentProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProfile = await StudentProfile.findOneAndUpdate(
      { studentId: id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 Get pending approvals (unverified items)
export const getPendingApprovals = async (req, res) => {
  try {
    const { department } = req.query;
    if (!department) return res.status(400).json({ message: "Department is required" });

    const pending = await StudentProfile.find({
      department,
      $or: [
        { "education.verified": false },
        { "experience.verified": false },
        { "certifications.verified": false },
      ],
    }).populate("studentId", "name email department");

    res.status(200).json(pending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 Approve student profile
export const approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    const result = await StudentProfile.updateOne(
      { studentId },
      {
        $set: {
          "education.$[].verified": true,
          "experience.$[].verified": true,
          "certifications.$[].verified": true,
        },
      }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ success: true, message: "Student approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟣 Reject student profile
export const rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const result = await StudentProfile.updateOne({ studentId }, { $set: { rejected: true } });
    if (result.matchedCount === 0) return res.status(404).json({ message: "Student not found" });

    res.status(200).json({ success: true, message: "Student rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 Get unverified profiles (for HOD)
export const getUnverifiedProfiles = async (req, res) => {
  try {
    const { department } = req.query;
    const filter = department ? { department } : {};

    const profiles = await StudentProfile.find({
      ...filter,
      $or: [
        { "education.verified": false },
        { "experience.verified": false },
        { "certifications.verified": false },
      ],
    }).populate("studentId", "name email department");

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 Verify education item
export const verifyEducationItem = async (req, res) => {
  try {
    const { studentId, itemId } = req.params;
    const result = await StudentProfile.updateOne(
      { studentId, "education.id": itemId },
      { $set: { "education.$.verified": true } }
    );
    res.status(200).json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 Verify experience item
export const verifyExperienceItem = async (req, res) => {
  try {
    const { studentId, itemId } = req.params;
    const result = await StudentProfile.updateOne(
      { studentId, "experience.id": itemId },
      { $set: { "experience.$.verified": true } }
    );
    res.status(200).json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 Verify certification item
export const verifyCertificationItem = async (req, res) => {
  try {
    const { studentId, itemId } = req.params;
    const result = await StudentProfile.updateOne(
      { studentId, "certifications.id": itemId },
      { $set: { "certifications.$.verified": true } }
    );
    res.status(200).json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
