import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarNavigator = ({ selectedDate, onDateChange }) => {
    // Generate 7 days around the selected date
    const getDays = () => {
        const days = [];
        for (let i = -3; i <= 3; i++) {
            const date = new Date(selectedDate);
            date.setDate(date.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        let year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    };

    const days = getDays();
    const todayStr = formatDate(new Date());

    return (
        <div className="flex items-center justify-between bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8">
            <button
                onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() - 1);
                    onDateChange(formatDate(d));
                }}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                {days.map((date, idx) => {
                    const dateStr = formatDate(date);
                    const isSelected = dateStr === selectedDate;
                    const isToday = dateStr === todayStr;

                    return (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onDateChange(dateStr)}
                            className={`flex flex-col items-center justify-center min-w-[3.5rem] h-14 rounded-2xl transition-all ${isSelected
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                                }`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-tighter ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                            </span>
                            <span className="text-sm font-black">
                                {date.getDate()}
                            </span>
                            {isToday && !isSelected && (
                                <div className="w-1 h-1 bg-indigo-400 rounded-full mt-0.5" />
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <button
                onClick={() => {
                    const d = new Date(selectedDate);
                    d.setDate(d.getDate() + 1);
                    onDateChange(formatDate(d));
                }}
                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default CalendarNavigator;
