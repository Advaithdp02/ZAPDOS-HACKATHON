// Sidebar.jsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/react.svg";
import { Home, Users, Book, ChevronRight, ChevronDown } from "lucide-react";

const iconMap = {
    Home: <Home size={20} />,
    Users: <Users size={20} />,
    Book: <Book size={20} />,
};

const menuItems = [
    {
        MenuID: 1,
        Title: "Student Management",
        Icon: "Users",
        Url: "/students",
        submenu: [
            { MenuID: 11, Title: "Add Student", Url: "/students/add" },
            { MenuID: 12, Title: "View Students", Url: "/students/view" },
        ],
    },
    {
        MenuID: 2,
        Title: "HOD Management",
        Icon: "Users",
        Url: "/hod",
        submenu: [
            { MenuID: 21, Title: "Add HOD", Url: "/hod/add" },
            { MenuID: 22, Title: "View HODs", Url: "/hod/view" },
        ],
    },
    {
        MenuID: 3,
        Title: "Training & Placement Officer",
        Icon: "Book",
        Url: "/tpo",
        submenu: [
            { MenuID: 31, Title: "Add TPO", Url: "/tpo/add" },
            { MenuID: 32, Title: "View TPOs", Url: "/tpo/view" },
        ],
    },
];

const Sidebar = () => {
    const [expanded, setExpanded] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const location = useLocation();

    const handleMenuClick = (idx) => {
        setActiveMenu((prev) => (prev === idx ? null : idx));
    };

    return (
        <div
            className={`bg-white border-r transition-all duration-300 ease-in-out h-screen relative ${expanded ? "w-60" : "w-16"}`}
            onMouseEnter={() => setExpanded(true)}
            onMouseLeave={() => setExpanded(false)}
        >
            <div className="flex flex-col items-start p-2 overflow-y-auto h-full pb-20">
                {menuItems.map((item, idx) => (
                    <div key={item.MenuID} className="w-full">
                        {item.submenu?.length ? (
                            <>
                                {/* Parent menu */}
                                <div
                                    className="flex items-center justify-between p-2 rounded cursor-pointer hover:bg-blue-100"
                                    onClick={() => handleMenuClick(idx)}
                                >
                                    <div className="flex items-center">
                                        {iconMap[item.Icon] || <Home size={20} />}
                                        <span
                                            className={`ml-3 text-sm transition-all duration-300 ease-in-out 
                                                ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"} 
                                                whitespace-nowrap`}
                                        >
                                            {item.Title}
                                        </span>
                                    </div>
                                    {expanded && (activeMenu === idx ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />)}
                                </div>

                                {/* Submenu */}
                                {expanded && activeMenu === idx && (
                                    <div className="ml-9 mt-1 flex flex-col gap-1">
                                        {item.submenu.map((subItem) => (
                                            <Link
                                                to={subItem.Url}
                                                key={subItem.MenuID}
                                                className={`text-sm text-gray-700 px-2 py-1 rounded transition-all duration-300 
                                                    ${location.pathname === subItem.Url ? "font-semibold text-blue-600" : ""}
                                                    hover:text-blue-600 hover:bg-gray-100 hover:shadow-sm 
                                                    opacity-100 translate-x-0`}
                                            >
                                                {subItem.Title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <Link
                                to={item.Url}
                                className={`flex items-center p-2 hover:bg-blue-100 rounded ${location.pathname === item.Url ? "bg-blue-100" : ""}`}
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
                        )}
                    </div>
                ))}
            </div>

            {/* Logo at Bottom */}
            <div className="absolute bottom-0 left-0 w-full p-4 flex items-center">
                <img src={logo} alt="Institution Logo" className="h-8 w-8 object-cover rounded-full" />
                <span
                    className={`ml-3 text-blue-600 font-bold text-sm transition-all duration-300 ease-in-out 
                        ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"} 
                        whitespace-nowrap`}
                >
                    Zapdos hiring station
                </span>
            </div>
        </div>
    );
};

export default Sidebar;
