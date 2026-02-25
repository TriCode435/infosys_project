import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target } from 'lucide-react';

const SmartStatCard = ({
    title,
    value,
    goal,
    unit,
    icon: Icon,
    color,
    progress,
    trend = null, // { value: string, up: boolean }
    label = null
}) => {
    const safeProgress = Math.min(Math.max(progress || 0, 0), 100);
    const strokeDasharray = 2 * Math.PI * 30; // Radius 30
    const strokeDashoffset = strokeDasharray * (1 - safeProgress / 100);

    return (
        <motion.div
            whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
            className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full group transition-all duration-300"
        >
            {/* Top Section */}
            <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-current flex items-center justify-center`}>
                    <Icon size={24} className={color.replace('bg-', 'text-')} />
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
                    {trend && (
                        <div className={`flex items-center gap-1 text-[10px] font-bold ${trend.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {trend.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                            {trend.value}
                        </div>
                    )}
                </div>
            </div>

            {/* Middle Section */}
            <div className="mb-6">
                <div className="flex items-baseline gap-1">
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h2>
                    <span className="text-xs font-bold text-slate-400">{unit}</span>
                </div>
                {goal && (
                    <div className="flex items-center gap-1 mt-1">
                        <Target size={12} className="text-slate-300" />
                        <p className="text-[11px] font-bold text-slate-400">
                            Goal: <span className="text-slate-600">{goal} {unit}</span>
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom Section - Circular Progress */}
            <div className="flex justify-between items-center mt-auto">
                <div className="relative w-14 h-14">
                    {/* Background Circle */}
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="transparent"
                            className="text-slate-100"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="28"
                            cy="28"
                            r="24"
                            stroke="currentColor"
                            strokeWidth="5"
                            fill="transparent"
                            strokeDasharray={150.8} // 2 * pi * 24
                            initial={{ strokeDashoffset: 150.8 }}
                            animate={{ strokeDashoffset: 150.8 * (1 - safeProgress / 100) }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            strokeLinecap="round"
                            className={color.replace('bg-', 'text-')}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[10px] font-black text-slate-700">{Math.round(safeProgress)}%</span>
                    </div>
                </div>

                {label && (
                    <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider ${safeProgress >= 100 ? 'bg-emerald-50 text-emerald-600' :
                            safeProgress >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                        {label}
                    </span>
                )}
            </div>
        </motion.div>
    );
};

export default SmartStatCard;
