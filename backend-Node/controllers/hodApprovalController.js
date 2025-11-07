import Student from "../models/Student.js";
import Hod from "../models/Hod.js";
import { sendEmail, templates } from "../utils/email.js";

// 🟡 Get all pending students (same department as HOD)
export const getPendingStudents = async (req, res) => {
  try {
    const hodId = req.user.id; // from JWT
    const hod = await Hod.findById(hodId);

    if (!hod) return res.status(404).json({ message: "HOD not found" });

    const students = await Student.find({
      department_id: hod.department_id,
      approved: false,
    }).select("first_name last_name email department_id year_of_study cgpa");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟢 Approve a student
export const approveStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const hodId = req.user.id;
    const hod = await Hod.findById(hodId);

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // 🧩 Ensure HOD can approve only students in their department
    if (student.department_id.toString() !== hod.department_id.toString()) {
      return res.status(403).json({ message: "Access denied. Student not in your department." });
    }

    student.approved = true;
    await student.save();

    // Optional: send approval email
    if (student.email) {
      const tpl = {
        subject: "Your account has been approved",
        html: `<p>Hi ${student.first_name},</p>
        <p>Your student account has been <strong>approved</strong> by your HOD. You can now access placement features.</p>
        <p>Best,<br/>Placement Cell</p>`,
        text: `Hi ${student.first_name}, your student account has been approved by your HOD.`,
      };
      sendEmail({ to: student.email, ...tpl }).catch(console.error);
    }

    res.status(200).json({ message: "Student approved successfully", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 Reject a student
export const rejectStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const hodId = req.user.id;
    const hod = await Hod.findById(hodId);
    const student = await Student.findById(studentId);

    if (!student) return res.status(404).json({ message: "Student not found" });
    if (student.department_id.toString() !== hod.department_id.toString()) {
      return res.status(403).json({ message: "Access denied. Student not in your department." });
    }

    await Student.findByIdAndDelete(studentId);

    // Optional: send rejection email
    if (student.email) {
      const tpl = {
        subject: "Your registration was not approved",
        html: `<p>Hi ${student.first_name},</p>
        <p>Your registration request was <strong>not approved</strong> by your HOD. Please contact your department for clarification.</p>
        <p>Regards,<br/>Placement Cell</p>`,
        text: `Hi ${student.first_name}, your registration request was not approved.`,
      };
      sendEmail({ to: student.email, ...tpl }).catch(console.error);
    }

    res.status(200).json({ message: "Student rejected and removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
