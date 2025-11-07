import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Eye } from "lucide-react";
import axios from "axios";

const StudentDataTable = () => {
  const [students, setStudents] = useState([]);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    // Fetch data from backend API
    axios.get("http://localhost:3000/api/students")
      .then(res => setStudents(res.data))
      .catch(err => console.error("Failed to fetch students:", err));
  }, []);

  // Filter students by name or email
  const filteredStudents = students.filter(
    s =>
      `${s.first_name} ${s.last_name}`.toLowerCase().includes(filterText.toLowerCase()) ||
      s.email.toLowerCase().includes(filterText.toLowerCase())
  );

  const columns = [
    {
      name: "Name",
      selector: row => `${row.first_name} ${row.last_name}`,
      sortable: true,
    },
    {
      name: "Status",
      sortable: true,
      cell: row => {
        const { personal_info, academic_info, documents, placement_eligibility } = row.verification;
        const allApproved = personal_info && academic_info && documents && placement_eligibility;

        return allApproved ? (
          <span className="px-2 py-1 rounded text-white text-sm bg-green-500">Approved</span>
        ) : (
          <span className="px-2 py-1 rounded text-white text-sm bg-yellow-500">Pending</span>
        );
      }
    },
    {
      name: "More Details",
      button: true,
      cell: row => (
        <button
          className="p-2 rounded hover:bg-gray-200"
          onClick={() => alert(`View details of ${row.first_name} ${row.last_name}`)}
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Students</h1>

      <input
        type="text"
        placeholder="Search by name or email..."
        value={filterText}
        onChange={e => setFilterText(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <DataTable
        columns={columns}
        data={filteredStudents}
        pagination
        highlightOnHover
        responsive
        striped
      />
    </div>
  );
};

export default StudentDataTable;
