import Student from "../models/Student.js";
import JobRole from "../models/JobRole.js";

// 🟢 Upload offer letter for a selected student
export const uploadOfferLetter = async (req, res) => {
  try {
    const { studentId, jobId } = req.params;

    // Validate student and job
    const student = await Student.findById(studentId);
    const job = await JobRole.findById(jobId);
    if (!student || !job) {
      return res.status(404).json({ message: "Student or Job not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Update student's offer letter info
    student.offer_letter = {
      file_url: `/uploads/offer_letters/${req.file.filename}`,
      job_role: jobId,
      uploaded_at: new Date()
    };

    await student.save();

    res.status(200).json({
      message: "Offer letter uploaded successfully",
      file_url: student.offer_letter.file_url
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
