import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Utensils,
    Plus,
    Flame,
    Droplets,
    TrendingUp,
    CheckCircle2,
    Calendar,
    Trash2,
    Target,
    Zap
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
    getNutritionLog,
    logNutrition,
    getDashboardSummary,
    deleteNutritionLog
} from "../../api/userApi";

const NutritionPage = () => {
    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [nutritionData, setNutritionData] = useState({
        caloriesTarget: 2000,
        proteinTarget: 150,
        carbsTarget: 300,
        fatsTarget: 70,
        caloriesConsumed: 0,
        proteinConsumed: 0,
        carbsConsumed: 0,
        fatsConsumed: 0,
        waterIntake: 0
    });
    const [loading, setLoading] = useState(true);
    const [isLogged, setIsLogged] = useState(false);
    const [allLogs, setAllLogs] = useState([]);

    const [formData, setFormData] = useState({
        calories: '', protein: '', carbs: '', fats: '', water: '', steps: ''
    });

    const fetchNutrition = useCallback(async () => {
        setLoading(true);
        try {
            const [nutRes, sumRes] = await Promise.all([
                getNutritionLog({ date: selectedDate }),
                getDashboardSummary({ startDate: selectedDate, endDate: selectedDate })
            ]);
            const summary = sumRes.data;
            const logs = Array.isArray(nutRes.data) ? nutRes.data : (nutRes.data ? [nutRes.data] : []);
            setAllLogs(logs);
            setNutritionData({
                caloriesTarget: summary.caloriesTarget || 2000,
                proteinTarget: summary.proteinTarget || 150,
                carbsTarget: summary.carbsTarget || 300,
                fatsTarget: summary.fatsTarget || 70,
                caloriesConsumed: summary.caloriesConsumed || 0,
                proteinConsumed: summary.proteinConsumed || 0,
                carbsConsumed: summary.carbsConsumed || 0,
                fatsConsumed: summary.fatsConsumed || 0,
                waterIntake: summary.water || 0
            });
            setIsLogged(logs.length > 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [selectedDate]);

    useEffect(() => { fetchNutrition(); }, [fetchNutrition]);

    const handleLogNutrition = async (e) => {
        e.preventDefault();
        try {
            await logNutrition({
                nutritionDate: selectedDate,
                caloriesConsumed: Number(formData.calories) || 0,
                proteinConsumed: Number(formData.protein) || 0,
                carbsConsumed: Number(formData.carbs) || 0,
                fatsConsumed: Number(formData.fats) || 0,
                waterIntake: Number(formData.water) || 0,
                steps: Number(formData.steps) || 0
            });
            fetchNutrition();
            setFormData({ calories: '', protein: '', carbs: '', fats: '', water: '', steps: '' });
        } catch (err) { alert("Failed to log."); }
    };

    const handleDeleteLog = async (id) => {
        if (!window.confirm("Delete?")) return;
        try { await deleteNutritionLog(id); fetchNutrition(); } catch (err) { alert("Error"); }
    };

    const overallProgress = Math.round(
        ((nutritionData.caloriesConsumed / (nutritionData.caloriesTarget || 1)) +
        (nutritionData.proteinConsumed / (nutritionData.proteinTarget || 1)) +
        (nutritionData.carbsConsumed / (nutritionData.carbsTarget || 1)) +
        (nutritionData.fatsConsumed / (nutritionData.fatsTarget || 1))) / 4 * 100
    );

    const MacroCard = ({ label, consumed, target, unit, color, icon: Icon }) => {
        const percentage = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;
        return (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #f1f5f9', boxShadow: '0 10px 25px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                    <div style={{ padding: '10px', background: `${color}15`, borderRadius: '12px', color: color }}><Icon size={20}/></div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase' }}>{label}</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: '900', color: '#1e293b' }}>{Math.round(consumed)}<span style={{ fontSize: '12px', color: '#94a3b8' }}>{unit}</span></div>
                    </div>
                </div>
                <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} style={{ height: '100%', background: color, borderRadius: '10px' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>
                    <span>{Math.round(percentage)}%</span>
                    <span>Goal: {target}{unit}</span>
                </div>
            </div>
        );
    };

    if (loading && allLogs.length === 0) return <div style={{ textAlign: 'center', padding: '100px', fontWeight: 'bold', color: '#94a3b8' }}>Loading Data...</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', fontFamily: 'Inter, sans-serif', color: '#0f172a' }}>
            
            {/* HEADER */}
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px', margin: 0 }}>Log your <span style={{ color: '#14b8a6', fontStyle: 'italic' }}>Fuel</span></h1>
                    <p style={{ color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '2px', marginTop: '10px' }}>Precision tracking for elite performance</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '10px 20px', borderRadius: '15px', border: '2px solid #f1f5f9' }}>
                    <Calendar size={18} color="#14b8a6" />
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} style={{ border: 'none', outline: 'none', fontWeight: '900', color: '#334155' }} />
                </div>
            </header>

            {/* INSIGHT CARD */}
            <div style={{ background: '#0f172a', padding: '2rem', borderRadius: '30px', color: 'white', marginBottom: '3rem', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}><TrendingUp color="#14b8a6" size={30} /></div>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Nutrition Progress Insight</h2>
                            <p style={{ color: '#94a3b8', fontSize: '12px', marginTop: '4px' }}>Overall completion of your macro targets</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '2.5rem', fontWeight: 900, color: '#14b8a6' }}>{overallProgress}%</span>
                        <span style={{ display: 'block', fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>Daily Score</span>
                    </div>
                </div>
            </div>

            {/* MACRO GRID */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '3rem' }}>
                <MacroCard label="Calories" consumed={nutritionData.caloriesConsumed} target={nutritionData.caloriesTarget} unit="kcal" color="#6366f1" icon={Flame} />
                <MacroCard label="Protein" consumed={nutritionData.proteinConsumed} target={nutritionData.proteinTarget} unit="g" color="#f43f5e" icon={Target} />
                <MacroCard label="Carbs" consumed={nutritionData.carbsConsumed} target={nutritionData.carbsTarget} unit="g" color="#f59e0b" icon={Utensils} />
                <MacroCard label="Fats" consumed={nutritionData.fatsConsumed} target={nutritionData.fatsTarget} unit="g" color="#10b981" icon={Droplets} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px' }}>
                {/* FORM */}
                <section style={{ background: 'white', padding: '2.5rem', borderRadius: '35px', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <div style={{ padding: '12px', background: '#14b8a6', borderRadius: '15px', color: 'white' }}><Plus /></div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>Add Daily Record</h3>
                    </div>

                    {isLogged ? (
                        <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '25px' }}>
                            <CheckCircle2 size={50} color="#10b981" style={{ marginBottom: '15px' }} />
                            <h4 style={{ fontWeight: 900 }}>Log Complete!</h4>
                        </div>
                    ) : (
                        <form onSubmit={handleLogNutrition} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            {['calories', 'protein', 'carbs', 'fats', 'water', 'steps'].map(field => (
                                <div key={field} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase' }}>{field}</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData[field]}
                                        onChange={(e) => setFormData({...formData, [field]: e.target.value})}
                                        style={{ padding: '15px', borderRadius: '15px', border: '2px solid #f1f5f9', background: '#f8fafc', fontWeight: 800, outline: 'none' }}
                                    />
                                </div>
                            ))}
                            <button type="submit" style={{ gridColumn: 'span 2', padding: '20px', borderRadius: '20px', border: 'none', background: '#14b8a6', color: 'white', fontWeight: 900, fontSize: '1rem', cursor: 'pointer', marginTop: '10px' }}>COMMIT DAILY LOG</button>
                        </form>
                    )}
                </section>

                {/* SIDEBAR LOGS */}
                <aside>
                    <h3 style={{ fontWeight: 900, marginBottom: '20px' }}>Today's Entries</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {allLogs.length === 0 ? (
                            <p style={{ color: '#94a3b8', fontWeight: 'bold', textAlign: 'center', padding: '20px', border: '2px dashed #f1f5f9', borderRadius: '20px' }}>No entries yet.</p>
                        ) : (
                            allLogs.map(log => (
                                <div key={log.id} style={{ background: 'white', padding: '15px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#6366f1' }}>{log.caloriesConsumed} kcal</div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 'bold' }}>P:{log.proteinConsumed}g | C:{log.carbsConsumed}g | F:{log.fatsConsumed}g</div>
                                    </div>
                                    <button onClick={() => handleDeleteLog(log.id)} style={{ border: 'none', background: 'none', color: '#cbd5e1', cursor: 'pointer' }}><Trash2 size={16}/></button>
                                </div>
                            ))
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default NutritionPage;