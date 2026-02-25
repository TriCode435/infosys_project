import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Scale, Ruler, ChevronRight, Activity, Info } from 'lucide-react';
import { getProfile } from '../../api/userApi';
import { useAuth } from '../../context/AuthContext';

const BMIPage = () => {
    const { user: authUser } = useAuth();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);

    const calculateBMIValue = (w, h) => {
        const hMetres = h / 100;
        return (w / (hMetres * hMetres)).toFixed(1);
    };

    const getBMICategory = (bmiValue) => {
        if (bmiValue < 18.5) return 'Underweight';
        if (bmiValue < 25) return 'Normal';
        if (bmiValue < 30) return 'Overweight';
        return 'Obese';
    };

    React.useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const res = await getProfile();
                if (res.data && res.data.weight && res.data.height) {
                    setWeight(res.data.weight);
                    setHeight(res.data.height);
                    const bmiValue = calculateBMIValue(res.data.weight, res.data.height);
                    setBmi(bmiValue);
                    setCategory(getBMICategory(bmiValue));
                }
            } catch (err) {
                console.error("Failed to fetch profile for BMI", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, []);

    const handleCalculate = (e) => {
        e.preventDefault();
        if (weight && height) {
            const bmiValue = calculateBMIValue(weight, height);
            setBmi(bmiValue);
            setCategory(getBMICategory(bmiValue));
        }
    };

    const getCategoryStyles = () => {
        if (category === 'Underweight') return { color: '#f59e0b', bg: '#fefce8', border: '#fef08a' };
        if (category === 'Normal') return { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)' };
        if (category === 'Overweight') return { color: '#f97316', bg: '#fff7ed', border: '#fed7aa' };
        return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)' };
    };

    const styles = getCategoryStyles();

    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            <header className="flex justify-between items-end" style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
                <div>
                    <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '2.25rem' }}>
                        BMI <span className="gradient-text tracking-tighter">Calculator</span>
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Personal body analytics</p>
                </div>
                <div className="card" style={{ padding: '0.75rem', borderRadius: '1rem' }}>
                    <Calculator size={24} className="text-primary" />
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                <div className="card" style={{ padding: '2rem' }}>
                    <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="grid grid-cols-2" style={{ gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>
                                    <Scale size={14} /> Weight (kg)
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    style={{ padding: '1.25rem', fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}
                                    placeholder="0"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <label className="text-slate-400 font-black uppercase tracking-widest flex items-center gap-2" style={{ fontSize: '12px', marginLeft: '0.25rem' }}>
                                    <Ruler size={14} /> Height (cm)
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    style={{ padding: '1.25rem', fontSize: '1.5rem', fontWeight: 900, color: '#1e293b' }}
                                    placeholder="0"
                                    value={height}
                                    onChange={(e) => setHeight(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.25rem', fontSize: '1.125rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Assess Results <ChevronRight size={20} />
                        </button>
                    </form>
                </div>

                {bmi && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{
                            position: 'relative', overflow: 'hidden', textAlign: 'center',
                            padding: '3rem', border: `2px solid ${styles.border}`,
                            background: styles.bg
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '1rem', opacity: 0.1 }}>
                            <Activity size={120} />
                        </div>

                        <p className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '12px', marginBottom: '1rem', letterSpacing: '0.2em' }}>Your Body Mass Index</p>
                        <h2 className="font-black text-slate-900 tracking-tighter" style={{ fontSize: '5rem', marginBottom: '1.5rem', lineHeight: 1 }}>
                            {bmi}
                        </h2>
                        <div style={{
                            display: 'inline-block', padding: '0.75rem 2rem',
                            borderRadius: '1rem', fontWeight: 900, fontSize: '1.25rem',
                            textTransform: 'uppercase', letterSpacing: '0.1em', boxShadow: '0 10px 15px rgba(0,0,0,0.05)',
                            backgroundColor: 'white', color: styles.color
                        }}>
                            {category}
                        </div>

                        <div style={{
                            marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.6)',
                            backdropFilter: 'blur(4px)', borderRadius: '1.5rem', display: 'flex',
                            alignItems: 'flex-start', gap: '1rem', textAlign: 'left', border: '1px solid white'
                        }}>
                            <div style={{ width: '2.5rem', height: '2.5rem', background: '#f1f5f9', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Info className="text-slate-400" size={20} />
                            </div>
                            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: '#475569', lineHeight: 1.6 }}>
                                {category === 'Underweight' && "Focus on nutrient-dense foods and strength training to build healthy mass."}
                                {category === 'Normal' && "Great job! Maintain your balanced diet and regular activity levels."}
                                {category === 'Overweight' && "Incorporate more cardio and monitor portion sizes to reach a healthier range."}
                                {category === 'Obese' && "Consider consulting a nutritionist for a structured weight management plan."}
                                <span style={{ display: 'block', marginTop: '0.5rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', fontSize: '10px' }}>Consult a professional for a deeper analysis.</span>
                            </p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default BMIPage;
