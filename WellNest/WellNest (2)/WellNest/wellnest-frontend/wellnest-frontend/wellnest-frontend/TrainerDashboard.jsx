import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Activity, Utensils, ChevronRight, Search, LogOut, TrendingUp, Filter, MoreVertical, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

const TrainerDashboard = () => {
    const { user, logout } = useAuth();
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAssignedUsers();
    }, []);

    const fetchAssignedUsers = async () => {
        try {
            const res = await api.get('/api/trainer/assigned-users');
            setAssignedUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = assignedUsers.filter(u =>
        (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.username || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="container" style={{ paddingBottom: '6rem', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <header className="flex flex-col animate-slide-up" style={{ gap: '1.5rem' }}>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '2.5rem', lineHeight: 1.1 }}>
                            Trainer <span className="gradient-text italic">Dashboard</span>
                        </h1>
                        <p className="text-slate-500 font-bold uppercase tracking-widest" style={{ fontSize: '14px', marginTop: '0.5rem' }}>
                            Managing <span className="text-slate-900">{assignedUsers.length}</span> Active Members
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="card" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', color: '#94a3b8', border: 'none', background: 'white' }}>
                            <User size={20} />
                        </Link>
                        <button onClick={logout} className="card" style={{ width: '3rem', height: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', color: '#ef4444', border: 'none', background: 'white', cursor: 'pointer' }}>
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8">
                {[
                    { icon: <Users size={28} />, label: 'Active Clients', value: assignedUsers.length, bg: 'linear-gradient(135deg, #2563eb 0%, #60a5fa 100%)', shadow: 'rgba(37, 99, 235, 0.2)' },
                    { icon: <Activity size={28} />, label: 'Assignments', value: '142', bg: 'var(--primary-gradient)', shadow: 'rgba(20, 184, 166, 0.2)' },
                    { icon: <TrendingUp size={28} />, label: 'Completion Rate', value: '89%', bg: 'linear-gradient(135deg, #22c55e 0%, #4ade80 100%)', shadow: 'rgba(34, 197, 94, 0.2)' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="card"
                        style={{
                            background: stat.bg, color: 'white', border: 'none',
                            boxShadow: `0 15px 30px ${stat.shadow}`, padding: '2rem',
                            position: 'relative', overflow: 'hidden'
                        }}
                    >
                        <div style={{ position: 'absolute', right: '-1.5rem', top: '-1.5rem', width: '8rem', height: '8rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(30px)' }} />
                        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(255,255,255,0.2)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <h3 className="font-black" style={{ fontSize: '2.5rem', lineHeight: 1 }}>{stat.value}</h3>
                                <p className="font-black uppercase tracking-widest" style={{ fontSize: '10px', opacity: 0.7 }}>{stat.label}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Users Section */}
            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="flex justify-between items-center" style={{ gap: '1.5rem' }}>
                    <h2 className="font-black text-slate-900 tracking-tight" style={{ fontSize: '1.5rem' }}>Assigned Members</h2>
                    <div className="flex items-center gap-4">
                        <div style={{ position: 'relative', width: '18rem' }}>
                            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search members..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="input-field"
                                style={{ paddingLeft: '3rem', paddingRight: '1rem', fontSize: '14px' }}
                            />
                        </div>
                        <button className="card" style={{ padding: '0.75rem', borderRadius: '0.75rem', color: '#94a3b8', border: 'none', background: 'white', cursor: 'pointer' }}>
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-8">
                    {filteredUsers.length === 0 && (
                        <div className="card" style={{ gridColumn: '1 / -1', padding: '5rem', textAlign: 'center', border: '2px dashed var(--border-color)', background: '#f8fafc' }}>
                            <Search size={48} className="text-slate-300" style={{ marginBottom: '1rem' }} />
                            <p className="text-slate-400 font-bold">No members match your search.</p>
                        </div>
                    )}
                    {filteredUsers.map((u, idx) => (
                        <motion.div
                            key={idx}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="card"
                            style={{ padding: 0, overflow: 'hidden', border: 'none' }}
                        >
                            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div className="flex justify-between items-center">
                                    <div style={{ width: '4rem', height: '4rem', background: '#f1f5f9', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', position: 'relative', overflow: 'hidden' }}>
                                        <Users size={32} />
                                    </div>
                                    <button style={{ color: '#cbd5e1', background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <MoreVertical size={20} />
                                    </button>
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900" style={{ fontSize: '1.25rem' }}>{u.fullName || u.username || 'Member'}</h4>
                                    <p className="font-black uppercase tracking-widest text-slate-400" style={{ fontSize: '10px', marginTop: '0.25rem' }}>{u.fitnessGoal || 'General Fitness'}</p>
                                </div>
                                <div className="flex gap-3">
                                    <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', fontSize: '10px', fontWeight: 900, borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active</div>
                                    <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(20, 184, 166, 0.1)', color: 'var(--primary)', fontSize: '10px', fontWeight: 900, borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Healthy</div>
                                </div>
                            </div>
                            <Link
                                to={`/trainer/user-details/${u.id || idx}`}
                                style={{
                                    display: 'block', padding: '1rem', background: '#f8fafc',
                                    textAlign: 'center', fontWeight: 900, fontSize: '10px',
                                    textTransform: 'uppercase', letterSpacing: '0.3em', color: '#94a3b8',
                                    textDecoration: 'none', borderTop: '1px solid #f1f5f9'
                                }}
                            >
                                Manage Plan
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default TrainerDashboard;
