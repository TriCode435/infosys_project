import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const AssignWeeklyPlanPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/api/trainer/assigned-users");
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        (u.fullName || u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#6366f1' }}>LOADING MEMBER DIRECTORY...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#0f172a', margin: 0 }}>ASSIGN <span style={{ color: '#6366f1' }}>WEEKLY PLAN</span></h1>
                <p style={{ fontSize: '14px', color: '#64748b', fontWeight: '600', marginTop: '8px' }}>Select an athlete to build their roadmap for the week.</p>
            </header>

            <div style={{ position: 'relative', marginBottom: '30px' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
                <input
                    type="text"
                    placeholder="Search by name or username..."
                    style={{ width: '100%', padding: '16px 16px 16px 52px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '15px', fontWeight: '600', outline: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
                {filteredUsers.length > 0 ? filteredUsers.map(u => (
                    <motion.div
                        key={u.id}
                        whileHover={{ scale: 1.01, x: 4 }}
                        onClick={() => navigate(`/trainer/user-details/${u.id}`)}
                        style={{
                            background: 'white',
                            padding: '20px 24px',
                            borderRadius: '16px',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ width: '48px', height: '48px', background: '#f8fafc', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', border: '1px solid #e2e8f0' }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{u.fullName || u.username}</h3>
                                <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>{u.fitnessGoal || 'General Fitness'}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6366f1', fontWeight: '800', fontSize: '13px' }}>
                            BUILD PLAN <ChevronRight size={18} />
                        </div>
                    </motion.div>
                )) : (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                        <Calendar size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                        <p style={{ fontWeight: '700' }}>No athletes found matching your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignWeeklyPlanPage;
