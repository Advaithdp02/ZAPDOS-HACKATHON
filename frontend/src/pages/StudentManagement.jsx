import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axiosClient from "../axios";

export default function StudentManagement() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await axiosClient.get("/getStudents");
      setStudents(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { name: "Name", selector: row => `${row.first_name} ${row.last_name}`, sortable: true },
    { name: "USN", selector: row => row.univesity_number },
    { name: "Email", selector: row => row.email },
    { name: "Department", selector: row => row.department_id?.name },
    { name: "CGPA", selector: row => row.cgpa },
    { name: "Placed", selector: row => row.placed ? "Yes" : "No" },
    {
      name: "Actions",
      cell: row => (
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-2 py-1 rounded text-sm">Edit</button>
          <button className="bg-red-600 text-white px-2 py-1 rounded text-sm">Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Student Management</h2>

      <DataTable
        columns={columns}
        data={students}
        pagination
        highlightOnHover
        pointerOnHover
      />
    </div>
  );
}
