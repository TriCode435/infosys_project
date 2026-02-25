import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Utensils, ChevronLeft, Calendar, Save, Clock, Target, Zap, ChefHat } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

const UserDetailDashboard = () => {
    const { id } = useParams();
    const [athlete, setAthlete] = useState(null);
    const [activeTab, setActiveTab] = useState('workout');
    const [workoutData, setWorkoutData] = useState({
        workoutName: '', targetReps: '', targetTime: '', date: new Date().toISOString().split('T')[0]
    });
    const [mealData, setMealData] = useState({
        protein: '', carbs: '', fats: '', calories: '', date: new Date().toISOString().split('T')[0]
    });

    React.useEffect(() => {
        const fetchAthlete = async () => {
            try {
                const res = await api.get(`/api/trainer/users/${id}/profile`);
                setAthlete(res.data);
            } catch (err) { console.error(err); }
        };
        fetchAthlete();
    }, [id]);

    const handleAssignWorkout = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/trainer/users/${id}/assign-workout`, workoutData);
            alert("Workout Plan Assigned!");
            setWorkoutData({ workoutName: '', targetReps: '', targetTime: '', date: new Date().toISOString().split('T')[0] });
        } catch (err) { console.error(err); }
    };

    const handleAssignMeal = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/api/trainer/users/${id}/assign-meal`, mealData);
            alert("Nutrition Plan Assigned!");
            setMealData({ protein: '', carbs: '', fats: '', calories: '', date: new Date().toISOString().split('T')[0] });
        } catch (err) { console.error(err); }
    };

    return (
        <div className="container" style={{ paddingBottom: '6rem', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <header className="flex items-center gap-6" style={{ paddingTop: '1rem' }}>
                <Link
                    to="/trainer/dashboard"
                    className="card"
                    style={{
                        width: '3rem', height: '3rem', borderRadius: '1rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#94a3b8', background: 'white', border: '1px solid #f1f5f9',
                        flexShrink: 0, textDecoration: 'none'
                    }}
                >
                    <ChevronLeft size={24} />
                </Link>
                <div>
                    <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '1.875rem' }}>
                        {athlete ? `Plan for: ${athlete.fullName || athlete.username}` : 'Member Plan'}
                    </h1>
                    <p className="text-slate-500 font-bold uppercase tracking-widest" style={{ fontSize: '10px', marginTop: '0.25rem' }}>Management Portal</p>
                </div>
            </header>

            <div style={{
                display: 'flex', gap: '1rem', padding: '0.375rem',
                background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '1.25rem'
            }}>
                <button
                    onClick={() => setActiveTab('workout')}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.75rem', padding: '0.875rem', borderRadius: '0.75rem',
                        fontSize: '12px', fontWeight: 900, textTransform: 'uppercase',
                        letterSpacing: '0.1em', transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
                        background: activeTab === 'workout' ? 'white' : 'transparent',
                        color: activeTab === 'workout' ? 'var(--primary)' : '#94a3b8',
                        boxShadow: activeTab === 'workout' ? 'var(--shadow-soft)' : 'none'
                    }}
                >
                    <Activity size={18} /> Training
                </button>
                <button
                    onClick={() => setActiveTab('meal')}
                    style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.75rem', padding: '0.875rem', borderRadius: '0.75rem',
                        fontSize: '12px', fontWeight: 900, textTransform: 'uppercase',
                        letterSpacing: '0.1em', transition: 'all 0.3s ease', border: 'none', cursor: 'pointer',
                        background: activeTab === 'meal' ? 'white' : 'transparent',
                        color: activeTab === 'meal' ? 'var(--secondary)' : '#94a3b8',
                        boxShadow: activeTab === 'meal' ? 'var(--shadow-soft)' : 'none'
                    }}
                >
                    <Utensils size={18} /> Nutrition
                </button>
            </div>

            <div style={{ position: 'relative' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'workout' ? (
                        <motion.div
                            key="workout"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="card"
                            style={{ padding: 0, overflow: 'hidden' }}
                        >
                            <div className="gradient-bg" style={{ padding: '2rem', color: 'white' }}>
                                <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
                                    <Zap size={28} />
                                </div>
                                <h3 className="font-black" style={{ fontSize: '1.5rem' }}>Assign Workout</h3>
                                <p style={{ opacity: 0.7, fontWeight: 500, fontStyle: 'italic', marginTop: '0.25rem' }}>Define the daily exercise routine</p>
                            </div>

                            <form onSubmit={handleAssignWorkout} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>Workout Focus</label>
                                    <input
                                        type="text"
                                        className="input-field"
                                        style={{ fontWeight: 700 }}
                                        placeholder="e.g. High Intensity Cardio"
                                        value={workoutData.workoutName}
                                        onChange={(e) => setWorkoutData({ ...workoutData, workoutName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>
                                            <Target size={14} /> Repetitions
                                        </label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ fontWeight: 700 }}
                                            placeholder="0"
                                            value={workoutData.targetReps}
                                            onChange={(e) => setWorkoutData({ ...workoutData, targetReps: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>
                                            <Clock size={14} /> Duration
                                        </label>
                                        <input
                                            type="text"
                                            className="input-field"
                                            style={{ fontWeight: 700 }}
                                            placeholder="e.g. 30:00 mins"
                                            value={workoutData.targetTime}
                                            onChange={(e) => setWorkoutData({ ...workoutData, targetTime: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>
                                        <Calendar size={14} /> Scheduled Date
                                    </label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        style={{ fontWeight: 700 }}
                                        value={workoutData.date}
                                        onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn-primary" style={{ padding: '1.25rem', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <Save size={20} /> Assign Workout
                                </button>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="meal"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="card"
                            style={{ padding: 0, overflow: 'hidden' }}
                        >
                            <div style={{ background: 'var(--secondary)', padding: '2rem', color: 'white' }}>
                                <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
                                    <ChefHat size={28} />
                                </div>
                                <h3 className="font-black" style={{ fontSize: '1.5rem' }}>Nutrition Plan</h3>
                                <p style={{ opacity: 0.7, fontWeight: 500, fontStyle: 'italic', marginTop: '0.25rem' }}>Set the daily nutrition goals</p>
                            </div>

                            <form onSubmit={handleAssignMeal} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>Energy (kcal)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ fontWeight: 900, textAlign: 'center', fontSize: '1.25rem' }}
                                            placeholder="2500"
                                            value={mealData.calories}
                                            onChange={(e) => setMealData({ ...mealData, calories: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>Protein (g)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ fontWeight: 900, textAlign: 'center', fontSize: '1.25rem' }}
                                            placeholder="180"
                                            value={mealData.protein}
                                            onChange={(e) => setMealData({ ...mealData, protein: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>Carbs (g)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ fontWeight: 900, textAlign: 'center', fontSize: '1.25rem' }}
                                            placeholder="300"
                                            value={mealData.carbs}
                                            onChange={(e) => setMealData({ ...mealData, carbs: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label className="text-slate-400 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>Fats (g)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            style={{ fontWeight: 900, textAlign: 'center', fontSize: '1.25rem' }}
                                            placeholder="70"
                                            value={mealData.fats}
                                            onChange={(e) => setMealData({ ...mealData, fats: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>
                                        <Calendar size={14} /> Activation Date
                                    </label>
                                    <input
                                        type="date"
                                        className="input-field"
                                        style={{ fontWeight: 700 }}
                                        value={mealData.date}
                                        onChange={(e) => setMealData({ ...mealData, date: e.target.value })}
                                    />
                                </div>

                                <button type="submit" className="btn-primary" style={{ background: 'var(--secondary)', boxShadow: 'var(--shadow-secondary)', padding: '1.25rem', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                    <Save size={20} /> Assign Plan
                                </button>
                            </form>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default UserDetailDashboard;
