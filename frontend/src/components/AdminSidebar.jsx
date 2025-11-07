// Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/react.svg";
import { Home, Users, Book } from "lucide-react";

const iconMap = {
    Home: <Home size={20} />,
    Users: <Users size={20} />,
    Book: <Book size={20} />,
};

const menuItems = [
    // eg:-
    // {
    //     MenuID: 1,
    //     Title: "Student Management",
    //     Icon: "Users",
    //     Url: "/students",
    // },
    {
        MenuID: 1,
        Title: "Student Management",
        Icon: "Users",
        Url: "/students",
    },
    {
        MenuID: 2,
        Title: "Head of Dept Management",
        Icon: "Users",
        Url: "/hod",
    },
    {
        MenuID: 3,
        Title: "Placement Officer Management",
        Icon: "Users",
        Url: "/tpo",
    },
];

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const location = useLocation();

    return (
        <div
            className={`bg-white border-r transition-all duration-300 ease-in-out h-screen relative ${expanded ? "w-70" : "w-16"}`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div className="flex flex-col items-start p-2 overflow-y-auto h-full pb-20">
                {menuItems.map((item) => (
                    <Link
                        key={item.MenuID}
                        to={item.Url}
                        className={`flex items-center p-2 hover:bg-blue-100 rounded transition-colors duration-200 
                            ${location.pathname === item.Url ? "bg-blue-100" : ""}`}
                    >
                        {iconMap[item.Icon] || <Home size={20} />}
                        <span
                            className={`ml-3 text-sm transition-all duration-300 ease-in-out 
                                ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"} 
                                whitespace-nowrap`}
                        >
                            {item.Title}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Logo at Bottom */}
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
                <img src={logo} alt="Institution Logo" className="h-8 w-8 object-cover rounded-full" />
                <span
                    className={`ml-3 text-yellow-600 font-bold text-sm transition-all duration-300 ease-in-out 
                        ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"} 
                        whitespace-nowrap`}
                >
                    Zapdos Hiring Station
                </span>
            </div>
        </div>
    );
};

export default Sidebar;
