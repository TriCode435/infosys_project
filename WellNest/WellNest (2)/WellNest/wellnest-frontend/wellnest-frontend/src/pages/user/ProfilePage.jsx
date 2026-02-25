import React, { useState, useEffect } from 'react';
import { User, Mail, Settings, ChevronRight, Bell, Shield, LogOut, Heart, Award, Target, Scale, Ruler, Edit3, Save, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const endpoint = user?.role === 'TRAINER' ? '/api/trainer/profile' : '/api/user/profile';
            const res = await api.get(endpoint);
            const profileData = res.data;
            if (user?.role === 'TRAINER') {
                profileData.specialization = profileData.specializations?.length > 0 ? profileData.specializations[0] : '';
            }
            setProfile(profileData);
            setFormData(profileData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const endpoint =
                user?.role === 'TRAINER'
                    ? '/api/trainer/profile'
                    : '/api/user/profile';

            let payload = { ...formData };
            if (user?.role === 'TRAINER') {
                payload.specializations = formData.specialization ? [formData.specialization] : [];
            } else {
                payload.targetWeight = formData.targetWeight ? Number(formData.targetWeight) : null;
                payload.targetTimeWeeks = formData.targetTimeWeeks ? Number(formData.targetTimeWeeks) : null;
            }

            // ⭐ FIX — convert target fields to numbers so backend saves them
            await api.put(endpoint, payload);

            // ⭐ refresh profile so values stay after save
            await fetchProfile();

            setIsEditing(false);
            alert("Profile updated successfully.");
        } catch (err) {
            console.error(err);
            alert("Update failed. Please check inputs.");
        }
    };

    if (loading) return <div className="p-10 text-center font-black uppercase tracking-widest">Loading Profile...</div>;

    return (
        <div className="container" style={{ paddingBottom: '6rem' }}>
            <header className="flex justify-between items-end" style={{ marginBottom: '2.5rem', paddingTop: '1rem' }}>
                <div>
                    <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '2.25rem' }}>
                        My <span className="gradient-text tracking-tighter">Profile</span>
                    </h1>
                    <p className="text-slate-500 font-bold tracking-widest uppercase" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Personal Settings & Health Data</p>
                </div>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="card"
                    style={{ width: '3.5rem', height: '3.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1.25rem', color: isEditing ? 'var(--primary)' : '#94a3b8' }}
                >
                    {isEditing ? <X size={22} /> : <Edit3 size={22} />}
                </button>
            </header>

            <AnimatePresence mode="wait">
                {!isEditing ? (
                    <motion.div
                        key="view"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <div className="card" style={{ textAlign: 'center', padding: '2.5rem', position: 'relative', overflow: 'hidden', marginBottom: '2rem' }}>
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '8px' }} className="gradient-bg" />
                            <div style={{
                                width: '7rem', height: '7rem', background: '#f1f5f9',
                                borderRadius: '2.5rem', margin: '0 auto 1.5rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '4px solid white', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div className="gradient-bg" style={{ position: 'absolute', inset: 0, opacity: 0.1 }} />
                                <User size={56} className="text-primary" style={{ position: 'relative', zIndex: 1 }} />
                            </div>
                            <h2 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '1.875rem' }}>{profile.fullName || profile.username || user?.username}</h2>
                            <div style={{ display: 'inline-block', padding: '0.375rem 1.25rem', background: 'rgba(20, 184, 166, 0.1)', borderRadius: '999px', marginTop: '0.75rem' }}>
                                <p className="font-black text-primary uppercase tracking-widest" style={{ fontSize: '10px', lineHeight: 1 }}>Account Type: {user?.role}</p>
                            </div>

                            {user?.role === 'TRAINER' ? (
                                <div className="grid grid-cols-2 gap-4" style={{ marginTop: '2.5rem' }}>
                                    <div className="card shadow-none bg-slate-50 border-none p-6">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Expertise</p>
                                        <p className="font-black text-slate-800">{profile.specialization || 'Generalist'}</p>
                                    </div>
                                    <div className="card shadow-none bg-slate-50 border-none p-6">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Availability</p>
                                        <p className="font-black text-slate-800 flex items-center gap-2">
                                            {profile.isAvailable ? (
                                                <><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span> Available to Book</>
                                            ) : (
                                                <><span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }}></span> Not Available</>
                                            )}
                                        </p>
                                    </div>
                                    <div className="card shadow-none bg-slate-50 border-none p-6">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Daily Hours</p>
                                        <p className="font-black text-slate-800">{profile.availableHoursPerDay || '--'} hrs/day</p>
                                    </div>
                                    <div className="card shadow-none bg-slate-50 border-none p-6">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Experience</p>
                                        <p className="font-black text-slate-800">{profile.experienceYears || '--'} years</p>
                                    </div>
                                    <div className="card shadow-none bg-slate-50 border-none p-6">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Rate</p>
                                        <p className="font-black text-slate-800">${profile.pricePerSession || '--'} / session</p>
                                    </div>
                                    <div className="card shadow-none bg-slate-50 border-none p-6 col-span-2 text-left">
                                        <p className="text-xs font-black text-slate-400 uppercase mb-1">Biography</p>
                                        <p className="font-medium text-slate-700 leading-relaxed whitespace-pre-wrap">{profile.bio || 'No biography set yet.'}</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-3 gap-4" style={{ marginTop: '2.5rem' }}>
                                        {[
                                            { label: 'Weight', value: profile.weight || '--', unit: 'kg', icon: <Scale size={14} />, color: '#f97316' },
                                            { label: 'Height', value: profile.height || '--', unit: 'cm', icon: <Ruler size={14} />, color: '#3b82f6' },
                                            { label: 'Age', value: profile.age || '--', unit: 'yrs', icon: <Heart size={14} />, color: '#ef4444' },
                                        ].map((item, idx) => (
                                            <div key={idx} style={{ padding: '1.25rem', background: '#f8fafc', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem' }}>
                                                <div style={{ color: item.color, opacity: 0.5, marginBottom: '0.25rem' }}>{item.icon}</div>
                                                <p className="font-black text-slate-400 uppercase tracking-widest" style={{ fontSize: '9px' }}>{item.label}</p>
                                                <p className="font-black text-slate-800" style={{ fontSize: '1.125rem' }}>
                                                    {item.value} <span style={{ fontSize: '10px', opacity: 0.4, fontStyle: 'italic' }}>{item.unit}</span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ marginTop: '2rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div className="card shadow-none bg-slate-50 border-none p-6">
                                            <p className="text-xs font-black text-slate-400 uppercase mb-2 flex items-center gap-2">
                                                <Target size={14} /> Fitness Objectives
                                            </p>
                                            <p className="font-medium text-slate-700 leading-relaxed">{profile.fitnessGoal || 'No goals set yet.'}</p>
                                        </div>
                                        {profile.fitnessGoal && (profile.fitnessGoal.toLowerCase().includes('weight') || profile.fitnessGoal.toLowerCase().includes('muscle')) && (
                                            <div className="grid grid-cols-2 gap-4" style={{ marginTop: '1.5rem' }}>
                                                <div className="card shadow-none bg-emerald-50/50 border-none p-6">
                                                    <p className="text-xs font-black text-emerald-400 uppercase mb-1">Target Weight</p>
                                                    <p className="font-black text-slate-800">{profile.targetWeight || '--'} kg</p>
                                                </div>
                                                <div className="card shadow-none bg-emerald-50/50 border-none p-6">
                                                    <p className="text-xs font-black text-emerald-400 uppercase mb-1">Target Time</p>
                                                    <p className="font-black text-slate-800">{profile.targetTimeWeeks || '--'} weeks</p>
                                                </div>
                                            </div>
                                        )}
                                        {profile.medicalNotes && (
                                            <div className="card shadow-none bg-red-50/50 border-none p-6">
                                                <p className="text-xs font-black text-red-400 uppercase mb-2 flex items-center gap-2">
                                                    <Shield size={14} /> Health Advisory
                                                </p>
                                                <p className="font-medium text-slate-700 leading-relaxed">{profile.medicalNotes}</p>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="edit"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="card p-8"
                    >
                        <form onSubmit={handleUpdate} className="flex flex-col gap-6">
                            <h3 className="font-black uppercase tracking-widest text-slate-400 text-xs text-center">Edit Control Console</h3>

                            {user?.role === 'TRAINER' ? (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Full Name</label>
                                        <input
                                            className="input-field"
                                            value={formData.fullName || ''}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            placeholder="Your Display Name"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Specialization</label>
                                        <select
                                            className="input-field"
                                            value={formData.specialization || ''}
                                            onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                                        >
                                            <option value="">Select Specialization</option>
                                            <option value="Weight Loss">Weight Loss</option>
                                            <option value="Muscle Gain">Muscle Gain</option>
                                            <option value="General Fitness">General Fitness</option>
                                            <option value="Strength Training">Strength Training</option>
                                            <option value="Yoga">Yoga</option>
                                            <option value="Rehabilitation">Rehabilitation</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Accepting New Clients?</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                                            style={{
                                                padding: '12px', borderRadius: '12px', border: '2px solid #e2e8f0',
                                                background: formData.isAvailable ? '#f0fdf4' : '#fef2f2',
                                                color: formData.isAvailable ? '#166534' : '#991b1b',
                                                fontWeight: 800, cursor: 'pointer', transition: '0.2s',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                            }}
                                        >
                                            <div style={{ width: 10, height: 10, borderRadius: '50%', background: formData.isAvailable ? '#22c55e' : '#ef4444' }}></div>
                                            {formData.isAvailable ? 'AVAILABLE FOR BOOKING' : 'NOT AVAILABLE'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase text-xs text-slate-400">Available Hours</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={formData.availableHoursPerDay || ''}
                                                onChange={(e) => setFormData({ ...formData, availableHoursPerDay: e.target.value })}
                                                placeholder="e.g. 5"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase text-xs text-slate-400">Experience (Years)</label>
                                            <input
                                                type="number"
                                                className="input-field"
                                                value={formData.experienceYears || ''}
                                                onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
                                                placeholder="e.g. 10"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Price per Session ($)</label>
                                        <input
                                            type="number"
                                            className="input-field"
                                            value={formData.pricePerSession || ''}
                                            onChange={(e) => setFormData({ ...formData, pricePerSession: e.target.value })}
                                            placeholder="e.g. 50"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Bio</label>
                                        <textarea
                                            className="input-field"
                                            value={formData.bio || ''}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Tell potential clients about yourself..."
                                            rows={4}
                                            style={{ minHeight: '100px', resize: 'vertical' }}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Full Name</label>
                                        <input
                                            className="input-field"
                                            value={formData.fullName || ''}
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase text-xs text-slate-400">Age</label>
                                            <input type="number" className="input-field" value={formData.age || ''} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase text-xs text-slate-400">Gender</label>
                                            <select className="input-field" value={formData.gender || ''} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                                                <option value="">Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase text-xs text-slate-400">Weight (kg)</label>
                                            <input type="number" className="input-field" value={formData.weight || ''} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="font-black uppercase text-xs text-slate-400">Height (cm)</label>
                                            <input type="number" className="input-field" value={formData.height || ''} onChange={(e) => setFormData({ ...formData, height: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Fitness Goals</label>
                                        <select
                                            className="input-field"
                                            value={formData.fitnessGoal || ''}
                                            onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
                                        >
                                            <option value="">Select Goal</option>
                                            <option value="Weight Loss">Weight Loss</option>
                                            <option value="Muscle Gain">Muscle Gain</option>
                                            <option value="Maintenance">Maintenance</option>
                                            <option value="Endurance">Endurance</option>
                                            <option value="Flexibility">Flexibility</option>
                                            <option value="General Health">General Health</option>
                                        </select>
                                    </div>

                                    {(formData.fitnessGoal?.toLowerCase().includes('weight') || formData.fitnessGoal?.toLowerCase().includes('muscle')) && (
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="font-black uppercase text-xs text-slate-400">Target Weight (kg)</label>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    value={formData.targetWeight || ''}
                                                    onChange={(e) => setFormData({ ...formData, targetWeight: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="font-black uppercase text-xs text-slate-400">Target Time (Weeks)</label>
                                                <input
                                                    type="number"
                                                    className="input-field"
                                                    value={formData.targetTimeWeeks || ''}
                                                    onChange={(e) => setFormData({ ...formData, targetTimeWeeks: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-2">
                                        <label className="font-black uppercase text-xs text-slate-400">Medical Notes</label>
                                        <textarea className="input-field" rows="2" value={formData.medicalNotes || ''} onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })} placeholder="Any conditions or allergies..." />
                                    </div>
                                </>
                            )}

                            <button type="submit" className="btn-primary py-4 uppercase font-black tracking-widest flex items-center justify-center gap-3">
                                <Save size={20} /> Save Changes
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-col gap-4 mt-6">
                <button
                    onClick={logout}
                    className="card"
                    style={{
                        padding: '1.5rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                        color: 'var(--error)', border: '2px dashed var(--border-color)',
                        background: 'transparent', cursor: 'pointer'
                    }}
                >
                    <LogOut size={22} />
                    <span className="font-black uppercase tracking-widest" style={{ fontSize: '14px' }}>Terminate Session</span>
                </button>
            </div>
        </div>
    );
};

export default ProfilePage;