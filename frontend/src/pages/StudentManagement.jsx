// pages/StudentManagement.jsx
import React from "react";
import Sidebar from "../components/AdminSidebar";
import StudentDataTable from "../components/StudentDataTable";

const StudentManagement = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Student Management</h1>
        <StudentDataTable />
      </div>
    </div>
  );
};

export default StudentManagement;
