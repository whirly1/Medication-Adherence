import React, { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const Sidebar = ({ chatDays, collapsed, setCollapsed }) => {
    const [selectedDay, setSelectedDay] = useState(chatDays[0] || ""); // Default to the first day if available

    return (
        <div className={`sidebar fixed top-[4rem] left-0 bg-gray-200 h-[calc(100vh-4rem)] p-4 border-r border-gray-300 flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
            <button
                onClick={() => setCollapsed((prev) => !prev)}
                className="absolute top-2 right-[-14px] bg-gray-200 border border-gray-300 p-1 rounded-full hover:bg-gray-300"
            >
                {collapsed ? (
                    <ChevronRightIcon className="w-5 h-5" />
                ) : (
                    <ChevronLeftIcon className="w-5 h-5" />
                )}
            </button>

            {!collapsed && (
                <>
                    <h2 className="text-lg font-bold mb-4">Chat History</h2>
                    <div className="flex-grow overflow-y-auto">
                        {chatDays.length === 0 ? (
                            <p className="text-gray-500">No conversations yet.</p>
                        ) : (
                            chatDays.map((day, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedDay(day)} // Update selected day on click
                                    className={`block w-full text-left p-2 rounded-md mb-2 ${
                                        selectedDay === day ? "bg-gray-500 text-white" : "hover:bg-gray-300"
                                    }`}
                                >
                                    {day}
                                </button>
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Sidebar;
