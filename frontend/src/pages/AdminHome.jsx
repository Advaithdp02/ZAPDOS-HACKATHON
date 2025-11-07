// Home.jsx
import React from "react";
import Sidebar from "../components/AdminSidebar";

const Home = () => {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main content */}
            <div className="flex-1 bg-gray-100 p-6 overflow-auto">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p>Welcome to the Student Management System!</p>
                
                {/* Add more content here */}
            </div>
        </div>
    );
};

export default Home;
