import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// 🟢 Generate Excel report
export const generateDepartmentExcel = async (req, res) => {
  try {
    const hod = await Hod.findById(req.user.id);
    const students = await Student.find({ department_id: hod.department_id })
      .populate("company_placed", "company_name")
      .populate("job_role_placed", "job_role package_lpa");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Placement Report");

    sheet.columns = [
      { header: "Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "CGPA", key: "cgpa", width: 10 },
      { header: "Placed", key: "placed", width: 10 },
      { header: "Company", key: "company", width: 25 },
      { header: "Package (LPA)", key: "package", width: 15 }
    ];

    students.forEach((s) => {
      sheet.addRow({
        name: `${s.first_name} ${s.last_name}`,
        email: s.email,
        cgpa: s.cgpa,
        placed: s.placed ? "Yes" : "No",
        company: s.company_placed?.company_name || "-",
        package: s.job_role_placed?.package_lpa || "-"
      });
    });

    const filePath = path.join("uploads", `Dept_Report_${hod._id}.xlsx`);
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔵 Generate PDF report
export const generateDepartmentPDF = async (req, res) => {
  try {
    const hod = await Hod.findById(req.user.id);
    const students = await Student.find({ department_id: hod.department_id })
      .populate("company_placed", "company_name")
      .populate("job_role_placed", "job_role package_lpa");

    const doc = new PDFDocument();
    const filePath = path.join("uploads", `Dept_Report_${hod._id}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    doc.fontSize(20).text(`Department Placement Report`, { align: "center" });
    doc.moveDown();

    students.forEach((s, i) => {
      doc.fontSize(12).text(
        `${i + 1}. ${s.first_name} ${s.last_name} (${s.email}) - CGPA: ${s.cgpa}, Placed: ${
          s.placed ? "Yes" : "No"
        }, Company: ${s.company_placed?.company_name || "-"}, Package: ${
          s.job_role_placed?.package_lpa || "-"
        } LPA`
      );
      doc.moveDown(0.5);
    });

    doc.end();
    writeStream.on("finish", () => {
      res.download(filePath);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getDepartmentStats = async (req, res) => {
  try {
    // 1. Find HOD and their department
    const hod = await Hod.findById(req.user.id);
    if (!hod) return res.status(404).json({ message: "HOD not found" });

    const deptId = hod.department_id;
    if (!deptId) return res.status(400).json({ message: "HOD does not have an associated department" });

    // 2. Basic counts
    const totalStudentsPromise = Student.countDocuments({ department_id: deptId });
    const approvedStudentsPromise = Student.countDocuments({ department_id: deptId, approved: true });
    const placedStudentsPromise = Student.countDocuments({ department_id: deptId, placed: true });

    const [totalStudents, approvedStudents, placedStudents] = await Promise.all([
      totalStudentsPromise,
      approvedStudentsPromise,
      placedStudentsPromise
    ]);

    // 3. Average CGPA for department (all students)
    const avgCgpaResult = await Student.aggregate([
      { $match: { department_id: new mongoose.Types.ObjectId(deptId) } },
      { $group: { _id: null, avgCgpa: { $avg: "$cgpa" } } }
    ]);
    const avgCgpa = (avgCgpaResult[0] && Number(avgCgpaResult[0].avgCgpa.toFixed(2))) || 0;

    // 4. Average package (LPA) among placed students in department
    //    We lookup jobroles to get package_lpa from job_role_placed reference
    const avgPackageResult = await Student.aggregate([
      { $match: { department_id: new mongoose.Types.ObjectId(deptId), placed: true, job_role_placed: { $ne: null } } },
      {
        $lookup: {
          from: "jobroles", // collection name (ensure this matches your DB)
          localField: "job_role_placed",
          foreignField: "_id",
          as: "jobRole"
        }
      },
      { $unwind: "$jobRole" },
      { $group: { _id: null, avgPackage: { $avg: "$jobRole.package_lpa" } } }
    ]);
    const avgPackage = (avgPackageResult[0] && Number(avgPackageResult[0].avgPackage.toFixed(2))) || 0;

    // 5. Company-wise placement counts
    const companyStats = await Student.aggregate([
      { $match: { department_id: new mongoose.Types.ObjectId(deptId), placed: true, company_placed: { $ne: null } } },
      {
        $lookup: {
          from: "companies",
          localField: "company_placed",
          foreignField: "_id",
          as: "company"
        }
      },
      { $unwind: "$company" },
      { $group: { _id: "$company.company_name", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 6. Year-wise placement breakdown (optional but helpful)
    const yearBreakdown = await Student.aggregate([
      { $match: { department_id: new mongoose.Types.ObjectId(deptId) } },
      { $group: { _id: "$year_of_study", total: { $sum: 1 }, placed: { $sum: { $cond: ["$placed", 1, 0] } } } },
      { $sort: { _id: 1 } }
    ]);

    // 7. Response
    res.status(200).json({
      totalStudents,
      approvedStudents,
      placedStudents,
      avgCgpa,
      avgPackage,
      companyStats,      // [{ _id: "Company A", count: 10 }, ...]
      yearBreakdown      // [{ _id: 1, total: 40, placed: 5 }, ...]
    });
  } catch (error) {
    console.error("getDepartmentStats error:", error);
    res.status(500).json({ message: error.message });
  }
};