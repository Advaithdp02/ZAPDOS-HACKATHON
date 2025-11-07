import Student from "../models/Student.js";
import Login from "../models/Login.js";
import Company from "../models/Company.js";
import JobRole from "../models/JobRole.js";
import RecruitmentRound from "../models/RecruitmentRound.js";
import { sendEmail, templates } from "../utils/email.js";

// 🟢 CREATE STUDENT
export const createStudent = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      address,
      photo_url,
      description,
      univesity_number,
      department_id,
      year_of_join,
      year_of_study,
      cgpa,
      backlogs,
      skills,
      certifications,
      password
    } = req.body;

    // Check for existing login or student
    const existingLogin = await Login.findOne({ email });
    const existingStudent = await Student.findOne({ univesity_number });

    if (existingLogin || existingStudent) {
      return res.status(400).json({ message: "Email or University Number already exists" });
    }

    // Create student record
    const student = await Student.create({
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone_number,
      address,
      photo_url,
      description,
      univesity_number,
      department_id,
      year_of_join,
      year_of_study,
      cgpa,
      backlogs,
      skills,
      certifications
    });

    // Create login for student (auto-hashed in pre-save hook)
    const login = await Login.create({
      email,
      password,
      role: "Student",
      referenceId: student._id,
      roleModel: "Student"
    });

    // Link login reference
    student.login_ref = login._id;
    await student.save();

    res.status(201).json({
      message: "Student and login created successfully",
      student
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟡 GET ALL STUDENTS
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate("department_id", "name code")
      .populate("company_placed", "company_name")
      .populate("job_role_placed", "job_role")
      .populate("companies_offered.company_id", "company_name")
      .populate("companies_offered.job_role_id", "job_role");

    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 GET SINGLE STUDENT BY ID
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate("department_id", "name code")
      .populate("company_placed", "company_name")
      .populate("job_role_placed", "job_role")
      .populate("companies_offered.company_id", "company_name")
      .populate("companies_offered.job_role_id", "job_role");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🟠 UPDATE STUDENT
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const student = await Student.findByIdAndUpdate(id, updates, { new: true })
      .populate("department_id", "name code")
      .populate("company_placed", "company_name")
      .populate("job_role_placed", "job_role")
      .populate("companies_offered.company_id", "company_name")
      .populate("companies_offered.job_role_id", "job_role");

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Update email in login if changed
    if (updates.email && student.login_ref) {
      await Login.findByIdAndUpdate(student.login_ref, { email: updates.email });
    }

    res.status(200).json({
      message: "Student updated successfully",
      student
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔴 DELETE STUDENT
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Delete linked login if exists
    if (student.login_ref) {
      await Login.findByIdAndDelete(student.login_ref);
    }

    await Student.findByIdAndDelete(id);

    res.status(200).json({ message: "Student and linked login deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getOfferLetters = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
      .populate("offer_letter.job_role", "job_role company package_lpa");
    
    if (!student.offer_letter?.file_url) {
      return res.status(404).json({ message: "No offer letter uploaded yet." });
    }

    res.status(200).json({
      file_url: student.offer_letter.file_url,
      job_role: student.offer_letter.job_role
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }};


/* ========================================================
   📄 Upload Resume
   ======================================================== */
export const uploadResume = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    student.resume_url = `/uploads/resumes/${req.file.filename}`;
    await student.save();

    res.status(200).json({
      message: "Résumé uploaded successfully",
      resume_url: student.resume_url,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================================================
   🚀 Get All Active Drives
   ======================================================== */
export const getMyDrives = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id);
    const drives = await JobRole.find({
      eligible_departments: student.department_id,
      application_deadline: { $gte: new Date() },
    }).populate("company", "company_name");

    res.status(200).json(drives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================================================
   🟢 Enroll in a Drive
   ======================================================== */
export const enrollInDrive = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;

    const job = await JobRole.findById(jobId).populate("company", "company_name");
    if (!job) return res.status(404).json({ message: "Job not found" });

    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // Eligibility check
    const eligibleDeptIds = job.eligible_departments.map(id => id.toString());
    if (!eligibleDeptIds.includes(student.department_id.toString())) {
      return res.status(403).json({ message: "Not eligible for this drive" });
    }

    // Register student in the first round (or create if none)
    let firstRound = await RecruitmentRound.findOne({ job_role: jobId }).sort({ round_date: 1 });
    if (!firstRound) {
      // Optionally create a default "Application" round
      firstRound = await RecruitmentRound.create({
        job_role: jobId,
        round_name: "Application",
        round_date: new Date(),
        created_by: req.user.id
      });
    }
    // avoid duplicate enrollment
    const already = firstRound.candidates.find(c => c.student.toString() === studentId);
    if (!already) {
      firstRound.candidates.push({ student: studentId, status: "Enrolled" });
      await firstRound.save();
    }

    // Send confirmation email (fire-and-forget)
    const tpl = templates.driveEnrollment({
      studentName: `${student.first_name} ${student.last_name}`,
      jobRole: job.job_role,
      company: job.company?.company_name || "",
      roundUrl: `${process.env.FRONTEND_URL || ""}/student/my-drives/${job._id}`
    });

    sendEmail({ to: student.email, ...tpl }).catch(err => console.error("Email failed:", err.message));

    res.status(200).json({ message: "Enrolled successfully", job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ========================================================
   📊 Get Drive Status / Round Results
   ======================================================== */
export const getMyDriveStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;

    const rounds = await RecruitmentRound.find({ job_role: jobId }).populate(
      "candidates.student",
      "first_name last_name email"
    );

    const statusList = rounds.map((r) => {
      const match = r.candidates.find(
        (c) => c.student._id.toString() === studentId
      );
      return {
        round_name: r.round_name,
        status: match?.status || "Not Participated",
        remarks: match?.remarks || "-",
      };
    });

    res.status(200).json(statusList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
