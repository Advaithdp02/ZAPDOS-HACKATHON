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
