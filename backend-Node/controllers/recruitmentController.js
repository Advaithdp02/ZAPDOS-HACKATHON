import RecruitmentRound from "../models/RecruitmentRound.js";
import JobRole from "../models/JobRole.js";
import Student from "../models/Student.js";
import { sendEmail, templates } from "../utils/email.js";


// 🟢 Create a recruitment round
export const createRecruitmentRound = async (req, res) => {
  try {
    const { job_role, round_name, round_date, conducted_by } = req.body;

    const existingJob = await JobRole.findById(job_role);
    if (!existingJob)
      return res.status(404).json({ message: "Job role not found" });

    const round = await RecruitmentRound.create({
      job_role,
      round_name,
      round_date,
      conducted_by,
      created_by: req.user.id, // logged-in TPO ID
    });

    // ✅ OPTIONAL: Send notification to all eligible students
    const eligibleStudents = await Student.find({
      department_id: { $in: existingJob.eligible_departments },
    });

    for (const s of eligibleStudents) {
      const tpl = templates.recruitmentRoundCreated({
        studentName: `${s.first_name} ${s.last_name}`,
        jobRole: existingJob.job_role,
        roundName: round_name,
        roundDate: round_date,
        roundUrl: `${process.env.FRONTEND_URL}/recruitments/${round._id}`,
      });

      // Fire and forget (don’t block request)
      sendEmail({ to: s.email, ...tpl }).catch((err) =>
        console.error("Email failed:", err.message)
      );
    }

    res.status(201).json({
      message: "Recruitment round created successfully",
      round,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟡 Get all rounds for a specific job
export const getRoundsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const rounds = await RecruitmentRound.find({ job_role: jobId })
      .populate("job_role", "job_role package_lpa")
      .populate("candidates.student", "first_name last_name email cgpa");

    res.status(200).json(rounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🟠 Update candidate status (selected/rejected/shortlisted)
export const updateCandidateStatus = async (req, res) => {
  try {
    const { roundId, studentId } = req.params;
    const { status, remarks } = req.body;

    // 1️⃣ Find the recruitment round
    const round = await RecruitmentRound.findById(roundId);
    if (!round) return res.status(404).json({ message: "Round not found" });

    // 2️⃣ Update or add candidate entry
    const candidate = round.candidates.find(
      (c) => c.student.toString() === studentId
    );

    if (candidate) {
      candidate.status = status;
      candidate.remarks = remarks;
    } else {
      round.candidates.push({ student: studentId, status, remarks });
    }

    await round.save();

    // 3️⃣ Fetch job and student details
    const job = await JobRole.findById(round.job_role).populate("company", "company_name");
    const student = await Student.findById(studentId);

    if (!student || !job) {
      return res.status(404).json({ message: "Student or Job not found" });
    }

    // 4️⃣ Update placement info if selected
    if (status === "Selected") {
      await Student.findByIdAndUpdate(studentId, {
        placed: true,
        company_placed: job.company,
        job_role_placed: job._id,
      });
    }

    // 5️⃣ Send a single email notification
    const tpl = templates.driveStatusUpdate({
      studentName: `${student.first_name} ${student.last_name}`,
      jobRole: job.job_role,
      roundName: round.round_name,
      status,
      remarks,
      detailsUrl: `${process.env.FRONTEND_URL || ""}/student/my-drives/${job._id}`,
    });

    sendEmail({ to: student.email, ...tpl }).catch((err) =>
      console.error("Email failed:", err.message)
    );

    // 6️⃣ Return response
    res.status(200).json({
      message: `Candidate status updated to ${status}`,
      round,
    });
  } catch (error) {
    console.error("Error updating candidate status:", error);
    res.status(500).json({ message: error.message });
  }
};


// 🔵 Get selected / rejected list for a job role
export const getFinalResults = async (req, res) => {
  try {
    const { jobId } = req.params;

    const rounds = await RecruitmentRound.find({ job_role: jobId })
      .populate("candidates.student", "first_name last_name email cgpa");

    const allCandidates = rounds.flatMap((r) => r.candidates);

    const selected = allCandidates.filter((c) => c.status === "Selected");
    const rejected = allCandidates.filter((c) => c.status === "Rejected");

    res.status(200).json({ selected, rejected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🧑‍🎓 GET all rounds a specific student is involved in
export const getStudentRecruitmentRounds = async (req, res) => {
  try {
    const studentId = req.user.id; // from JWT (Student)

    const rounds = await RecruitmentRound.find({
      "candidates.student": studentId,
    })
      .populate("job_role", "job_role package_lpa job_location")
      .populate("candidates.student", "first_name last_name email cgpa");

    if (!rounds.length)
      return res
        .status(200)
        .json({ message: "No recruitment rounds found for this student." });

    // Filter to only show current student's status in each round
    const filteredRounds = rounds.map((round) => {
      const studentData = round.candidates.find(
        (c) => c.student._id.toString() === studentId
      );
      return {
        _id: round._id,
        job_role: round.job_role,
        round_name: round.round_name,
        round_date: round.round_date,
        conducted_by: round.conducted_by,
        status: studentData?.status || "Not Applied",
        remarks: studentData?.remarks || null,
      };
    });

    res.status(200).json(filteredRounds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🧑‍🎓 GET a student's status for a specific job role
export const getStudentJobStatus = async (req, res) => {
  try {
    const studentId = req.user.id;
    const { jobId } = req.params;

    const rounds = await RecruitmentRound.find({ job_role: jobId }).populate(
      "candidates.student",
      "first_name last_name email"
    );

    // Collect all statuses for this student in all rounds
    const statuses = rounds
      .map((r) => {
        const c = r.candidates.find(
          (x) => x.student._id.toString() === studentId
        );
        return c
          ? {
              round_name: r.round_name,
              status: c.status,
              remarks: c.remarks,
            }
          : null;
      })
      .filter(Boolean);

    if (statuses.length === 0)
      return res.status(200).json({
        message:
          "You have not participated in this job's recruitment process yet.",
      });

    res.status(200).json({ jobId, statuses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🟣 Publish Final Results — email all selected/rejected candidates
export const publishFinalResults = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1️⃣ Check if already published
    const alreadyPublished = await RecruitmentRound.findOne({ job_role: jobId, published: true });
    if (alreadyPublished) {
      return res.status(400).json({ message: "Results for this job have already been published." });
    }

    // 2️⃣ Get all rounds for this job
    const rounds = await RecruitmentRound.find({ job_role: jobId })
      .populate("candidates.student", "first_name last_name email")
      .populate("job_role", "job_role");

    if (!rounds.length)
      return res.status(404).json({ message: "No rounds found for this job" });

    const allCandidates = rounds.flatMap((r) => r.candidates);
    const selected = allCandidates.filter((c) => c.status === "Selected");
    const rejected = allCandidates.filter((c) => c.status === "Rejected");

    // 3️⃣ Send emails to selected candidates
    for (const c of selected) {
      const tpl = templates.statusUpdated({
        studentName: `${c.student.first_name} ${c.student.last_name}`,
        jobRole: rounds[0].job_role.job_role,
        roundName: "Final Result",
        status: "Selected",
        remarks: "🎉 Congratulations! You’ve been selected for this role.",
        detailsUrl: `${process.env.FRONTEND_URL}/offer-letter`,
      });

      sendEmail({ to: c.student.email, ...tpl }).catch((err) =>
        console.error("Email failed:", err.message)
      );
    }

    // 4️⃣ Send emails to rejected candidates
    for (const c of rejected) {
      const tpl = templates.statusUpdated({
        studentName: `${c.student.first_name} ${c.student.last_name}`,
        jobRole: rounds[0].job_role.job_role,
        roundName: "Final Result",
        status: "Rejected",
        remarks:
          "Thank you for participating. Unfortunately, you were not selected this time. Keep improving and try again!",
      });

      sendEmail({ to: c.student.email, ...tpl }).catch((err) =>
        console.error("Email failed:", err.message)
      );
    }

    // 5️⃣ Mark all rounds for this job as published
    await RecruitmentRound.updateMany({ job_role: jobId }, { published: true });

    res.status(200).json({
      message: "✅ Final results published and emails sent successfully",
      selectedCount: selected.length,
      rejectedCount: rejected.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
