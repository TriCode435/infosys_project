import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Smile, Meh, Frown, Sun, CloudRain, Save } from 'lucide-react';
import { logSleepMood } from '../api/userApi';

const moods = [
    { icon: Sun, label: 'Energetic', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Smile, label: 'Happy', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Meh, label: 'Neutral', color: 'text-slate-500', bg: 'bg-slate-50' },
    { icon: CloudRain, label: 'Tired', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: Frown, label: 'Stressed', color: 'text-rose-500', bg: 'bg-rose-50' },
];

const SleepMoodModal = ({ isOpen, onClose, onSuccess, selectedDate }) => {
    const [sleepHours, setSleepHours] = useState(8);
    const [selectedMood, setSelectedMood] = useState('Neutral');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await logSleepMood({
                date: selectedDate,
                sleepHours: Number(sleepHours),
                mood: selectedMood
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Failed to log sleep/mood", err);
            alert("Failed to log recovery data. You might have already logged for today.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-500" />

                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Log <span className="text-indigo-600 italic">Recovery</span></h2>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Sleep Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sleep Duration</label>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-black text-slate-800">{sleepHours}</span>
                                    <span className="text-xs font-bold text-slate-400 uppercase">hours</span>
                                </div>
                            </div>
                            <div className="relative pt-6 pb-2">
                                <input
                                    type="range"
                                    min="0"
                                    max="15"
                                    step="0.5"
                                    value={sleepHours}
                                    onChange={(e) => setSleepHours(e.target.value)}
                                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                />
                                <div className="flex justify-between mt-2 text-[9px] font-black text-slate-300 uppercase tracking-tighter">
                                    <span>0 hrs</span>
                                    <span>7.5 hrs</span>
                                    <span>15 hrs</span>
                                </div>
                            </div>
                        </div>

                        {/* Mood Picker */}
                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Current Vibe</label>
                            <div className="grid grid-cols-5 gap-3">
                                {moods.map((mood) => (
                                    <button
                                        key={mood.label}
                                        type="button"
                                        onClick={() => setSelectedMood(mood.label)}
                                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all duration-300 ${selectedMood === mood.label
                                                ? `border-indigo-500 ${mood.bg} ring-4 ring-indigo-50`
                                                : 'border-slate-50 hover:border-slate-100 hover:bg-slate-50'
                                            }`}
                                    >
                                        <mood.icon size={20} className={selectedMood === mood.label ? mood.color : 'text-slate-400'} />
                                        <span className={`text-[8px] font-black uppercase tracking-tighter ${selectedMood === mood.label ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            {mood.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-slate-900 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <><Save size={18} /> Sync Recovery Data</>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default SleepMoodModal;
