import Application from "../models/Application.js";
import Company from "../models/Company.js";
import StudentProfile from "../models/StudentProfile.js";
import Drive from "../models/Drive.js";

/**
 * 📊 Get number of offers by company
 */
export const getOffersByCompany = async (req, res) => {
  try {
    // Fetch all companies and their related offers
    const companies = await Company.find();
    const drives = await Drive.find();
    const applications = await Application.find();

    const offers = companies.map((company) => {
      const companyDrives = drives.filter(
        (d) => d.companyId.toString() === company._id.toString()
      );
      const driveIds = companyDrives.map((d) => d._id.toString());

      const offerCount = applications.filter(
        (a) =>
          driveIds.includes(a.driveId.toString()) &&
          a.status.toLowerCase() === "offered"
      ).length;

      return { name: company.name, count: offerCount };
    });

    const filtered = offers.filter((c) => c.count > 0);
    res.status(200).json(filtered);
  } catch (error) {
    console.error("Error fetching offers by company:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * 🏫 Get number of offers by department
 */
export const getOffersByDepartment = async (req, res) => {
  try {
    const { department } = req.query;

    const filter = department ? { department } : {};
    const students = await StudentProfile.find(filter);
    const applications = await Application.find();

    const departments = department
      ? [department]
      : [...new Set(students.map((s) => s.department))];

    const results = departments.map((dept) => {
      const deptStudents = students.filter((s) => s.department === dept);
      const studentIds = deptStudents.map((s) => s.studentId.toString());

      const offers = applications.filter(
        (a) =>
          studentIds.includes(a.studentId.toString()) &&
          a.status.toLowerCase() === "offered"
      ).length;

      return { name: dept, count: offers };
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching offers by department:", error);
    res.status(500).json({ message: error.message });
  }
};
