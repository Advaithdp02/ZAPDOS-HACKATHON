import fs from "fs";
import { ObjectId } from "mongodb";

const departments = [
  "690de76c1ca580798872fc56", // CSE
  "690de76c1ca580798872fc57", // ECE
  "690de76c1ca580798872fc58", // ME
  "690de76c1ca580798872fc59", // EEE
  "690de76c1ca580798872fc60", // CE
  "690de76c1ca580798872fc61"  // IT
];

const skills = [
  ["Python", "React", "Node.js"],
  ["C", "C++", "Verilog"],
  ["SolidWorks", "AutoCAD"],
  ["MATLAB", "Power Systems"],
  ["Surveying", "Civil 3D"],
  ["HTML", "CSS", "JavaScript"]
];

let students = [];

departments.forEach((dept, i) => {
  for (let j = 1; j <= 10; j++) {
    const id = new ObjectId();
    const loginId = new ObjectId();

    students.push({
      _id: { $oid: id.toString() }, // ✅ Proper MongoDB ObjectId format
      first_name: `Student${i + 1}${j}`,
      last_name: "Test",
      gender: j % 2 === 0 ? "Female" : "Male",
      date_of_birth: {
        $date: new Date(2003, j % 12, (j * 2) % 28 + 1).toISOString(),
      },
      email: `student${i + 1}${j}@college.edu`,
      phone_number: `98765${10000 + i * 10 + j}`,
      address: "Bangalore, India",
      photo_url: "https://example.com/photo.jpg",
      description: `Student from dept ${dept}`,
      univesity_number: `${["CSE","ECE","ME","EEE","CE","IT"][i]}2023${100 + j}`,
      department_id: { $oid: dept },
      year_of_join: 2023,
      year_of_study: 3,
      cgpa: parseFloat((7.0 + Math.random() * 3).toFixed(2)),
      backlogs: j % 3 === 0 ? 1 : 0,
      skills: skills[i],
      certifications: [],
      placed: false,
      verification: {
        personal_info: true,
        academic_info: true,
        documents: true,
        placement_eligibility: true
      },
      companies_offered: [],
      createdAt: { $date: new Date().toISOString() },
      updatedAt: { $date: new Date().toISOString() },
      __v: 0,
      login_ref: { $oid: loginId.toString() }
    });
  }
});

fs.writeFileSync("students.json", JSON.stringify(students, null, 2));
console.log("✅ 60 students generated with valid ObjectIds!");
