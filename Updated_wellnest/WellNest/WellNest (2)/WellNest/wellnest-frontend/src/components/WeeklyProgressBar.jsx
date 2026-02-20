import React from "react";

const WeeklyProgressBar = ({ progress }) => {
    return (
        <div className="w-full bg-slate-200 rounded-full h-3 mb-4 overflow-hidden relative">
            <div
                className="bg-primary h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
            ></div>
        </div>
    );
};

export default WeeklyProgressBar;
