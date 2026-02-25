import React, { useEffect, useState } from 'react';
import UserDashboard from '../user/UserDashboard';
import TrainerDashboard from '../trainer/TrainerDashboard';
import api from '../../api/axios';
import { ShieldCheck, UserPlus, Zap, Trash2, Users, History, Activity, MessageSquare, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [tips, setTips] = useState([]);
    const [newTip, setNewTip] = useState('');
    const [loading, setLoading] = useState(true);
    const [assignmentData, setAssignmentData] = useState({ trainerId: '', userId: '' });
    const [selectedUser, setSelectedUser] = useState(null);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [reportedPosts, setReportedPosts] = useState([]);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [uRes, tRes, tipsRes] = await Promise.all([
                api.get('/api/admin/users'),
                api.get('/api/admin/trainers'),
                api.get('/api/admin/tips')
            ]);
            setUsers([...uRes.data, ...tRes.data.filter(t => !uRes.data.some(u => u.id === t.id))]);
            setTips(tipsRes.data);
        } catch (e) {
            console.error("Error fetching main dashboard data:", e);
        }

        try {
            const [pendingRes, reportedRes] = await Promise.all([
                api.get('/api/blog/admin/pending'),
                api.get('/api/blog/admin/reported')
            ]);
            setPendingPosts(pendingRes.data.content || []);
            setReportedPosts(reportedRes.data || []);
        } catch (e) {
            console.error("Error fetching moderation data:", e);
        }

        setLoading(false);
    };

    const handleAddTip = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/tips', newTip, { headers: { 'Content-Type': 'text/plain' } });
            setNewTip('');
            fetchData();
        } catch (error) { console.error(error); }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/admin/assign', null, {
                params: { trainerId: assignmentData.trainerId, userId: assignmentData.userId }
            });
            alert('Roster Updated Successfully!');
            setAssignmentData({ trainerId: '', userId: '' });
            fetchData();
        } catch (err) { alert('Assignment Failed'); }
    };

    const handleApprove = async (id) => {
        try {
            await api.put(`/api/blog/admin/${id}/approve`);
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleReject = async (id) => {
        try {
            await api.put(`/api/blog/admin/${id}/reject`);
            fetchData();
        } catch (e) { console.error(e); }
    };

    const handleDeletePost = async (id) => {
        if (window.confirm('Delete this post permanently?')) {
            try {
                await api.delete(`/api/blog/${id}`);
                fetchData();
            } catch (e) { console.error(e); }
        }
    };

    const handleResolveReport = async (reportId) => {
        try {
            await api.put(`/api/blog/admin/report/${reportId}/resolve`);
            fetchData();
        } catch (e) { console.error(e); }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', color: '#10b981', fontWeight: '900' }}>
            DECRYPTING SYSTEM DATA...
        </div>
    );

    const trainers = users.filter(u => u.role === 'TRAINER');
    const regularUsers = users.filter(u => u.role === 'USER');

    // UI Style Config
    const glassStyle = {
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        padding: '30px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
    };

    return (
        <div style={{ backgroundColor: '#f0f4f8', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Inter", sans-serif' }}>
            <div style={{ maxWidth: '1300px', margin: '0 auto' }}>

                {/* 1. Header with Glow */}
                <header style={{ marginBottom: '50px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#1e293b', margin: 0, letterSpacing: '-1px' }}>
                            ADMIN <span style={{ color: '#6366f1', fontStyle: 'italic' }}>CORE</span>
                        </h1>
                        <p style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '5px' }}>
                            Authorized Personnel Only • WellNest System
                        </p>
                    </div>
                    <div style={{ background: '#1e293b', color: '#fff', padding: '12px 24px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', fontWeight: 'bold', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                        <ShieldCheck size={18} color="#10b981" /> MASTER ACCESS
                    </div>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '30px' }}>

                    {/* 2. Roster Management (Left) */}
                    <motion.section whileHover={{ y: -5 }} style={glassStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <div style={{ background: '#6366f1', padding: '10px', borderRadius: '12px', color: 'white' }}><UserPlus size={20} /></div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: 0 }}>ROSTER ASSIGNMENT</h3>
                        </div>
                        <form onSubmit={handleAssign} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', display: 'block', marginBottom: '8px' }}>SELECT ATHLETE</label>
                                <select
                                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #f1f5f9', fontWeight: '700', fontSize: '14px', outline: 'none', background: '#fff' }}
                                    value={assignmentData.userId}
                                    onChange={(e) => setAssignmentData({ ...assignmentData, userId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose Member...</option>
                                    {regularUsers.map(u => <option key={u.id} value={u.id}>{u.username} (ID: {u.id})</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ fontSize: '10px', fontWeight: '900', color: '#64748b', display: 'block', marginBottom: '8px' }}>ASSIGN TRAINER</label>
                                <select
                                    style={{ width: '100%', padding: '15px', borderRadius: '15px', border: '2px solid #f1f5f9', fontWeight: '700', fontSize: '14px', outline: 'none', background: '#fff' }}
                                    value={assignmentData.trainerId}
                                    onChange={(e) => setAssignmentData({ ...assignmentData, trainerId: e.target.value })}
                                    required
                                >
                                    <option value="">Choose Coach...</option>
                                    {trainers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                                </select>
                            </div>
                            <button type="submit" style={{ background: '#6366f1', color: 'white', padding: '18px', borderRadius: '18px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '12px', letterSpacing: '1px', marginTop: '10px', boxShadow: '0 10px 20px rgba(99, 102, 241, 0.2)' }}>CONFIRM CONNECTION</button>
                        </form>
                    </motion.section>

                    {/* 3. Global Wisdom (Right) */}
                    <motion.section whileHover={{ y: -5 }} style={{ ...glassStyle, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.2)', padding: '10px', borderRadius: '12px' }}><Zap size={20} fill="white" /></div>
                            <h3 style={{ fontSize: '20px', fontWeight: '900', margin: 0 }}>GLOBAL WISDOM</h3>
                        </div>
                        <textarea
                            style={{ width: '100%', background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '20px', padding: '20px', color: 'white', fontWeight: '600', minHeight: '140px', outline: 'none', marginBottom: '20px' }}
                            placeholder="Broadcast daily fitness tip to all users..."
                            value={newTip}
                            onChange={(e) => setNewTip(e.target.value)}
                        />
                        <button onClick={handleAddTip} style={{ width: '100%', background: 'white', color: '#10b981', padding: '15px', borderRadius: '15px', border: 'none', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}>PUBLISH TO ECOSYSTEM</button>
                    </motion.section>
                </div>

                {/* 4. User Vault Table */}
                <div style={{ ...glassStyle, marginTop: '40px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                        <Users color="#6366f1" size={24} />
                        <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b' }}>IDENTITY <span style={{ color: '#94a3b8' }}>VAULT</span></h3>
                    </div>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                            <thead>
                                <tr style={{ textAlign: 'left' }}>
                                    <th style={{ padding: '15px', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>IDENTITY</th>
                                    <th style={{ padding: '15px', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>CLEARANCE</th>
                                    <th style={{ padding: '15px', textAlign: 'right', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ background: '#f8fafc', borderRadius: '15px' }}>
                                        <td style={{ padding: '20px', fontWeight: '800', color: '#334155', borderRadius: '15px 0 0 15px' }}>
                                            {u.username} <span style={{ color: '#cbd5e1', fontSize: '10px', marginLeft: '5px' }}>#{u.id}</span>
                                        </td>
                                        <td style={{ padding: '20px' }}>
                                            <span style={{
                                                padding: '6px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: '900',
                                                background: u.role === 'TRAINER' ? '#e0e7ff' : u.role === 'ADMIN' ? '#fef2f2' : '#ecfdf5',
                                                color: u.role === 'TRAINER' ? '#4338ca' : u.role === 'ADMIN' ? '#ef4444' : '#059669'
                                            }}>{u.role}</span>
                                        </td>
                                        <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 15px 15px 0' }}>

                                            {/* 👁 VIEW DASHBOARD */}
                                            <Eye
                                                size={18}
                                                style={{ cursor: "pointer", color: "#14b8a6", marginRight: "14px" }}
                                                onClick={() => setSelectedUser(u)}
                                            />

                                            <button
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#f87171',
                                                    cursor: 'pointer',
                                                    fontWeight: '800',
                                                    fontSize: '11px'
                                                }}
                                            >
                                                REVOKE ACCESS
                                            </button>

                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                            {/* 👁 ADMIN VIEW DASHBOARD */}
                            {selectedUser && (
                                <div style={{ marginTop: "40px" }}>
                                    {selectedUser.role === 'TRAINER' ? (
                                        <TrainerDashboard viewedTrainer={selectedUser} />
                                    ) : (
                                        <UserDashboard viewedUser={selectedUser} />
                                    )}
                                </div>
                            )}
                        </table>
                    </div>
                </div>

                {/* 5. Pending Posts Table */}
                <div style={{ ...glassStyle, marginTop: '40px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                        <ShieldCheck color="#6366f1" size={24} />
                        <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b' }}>PENDING <span style={{ color: '#94a3b8' }}>POSTS</span></h3>
                    </div>
                    {pendingPosts.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>No posts pending approval.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '15px', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>POST TITLE</th>
                                        <th style={{ padding: '15px', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>AUTHOR</th>
                                        <th style={{ padding: '15px', textAlign: 'right', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingPosts.map(p => (
                                        <tr key={p.id} style={{ background: '#f8fafc', borderRadius: '15px' }}>
                                            <td style={{ padding: '20px', fontWeight: '800', color: '#334155', borderRadius: '15px 0 0 15px' }}>
                                                {p.title} <br /><span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '500' }}>{p.content.substring(0, 50)}...</span>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', background: '#e0e7ff', color: '#4338ca' }}>
                                                    {p.authorName} ({p.authorRole})
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 15px 15px 0', gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleApprove(p.id)} style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>APPROVE</button>
                                                <button onClick={() => handleReject(p.id)} style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>REJECT</button>
                                                <button onClick={() => handleDeletePost(p.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>DELETE</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 6. Reported Posts Table */}
                <div style={{ ...glassStyle, marginTop: '40px', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                        <Activity color="#ef4444" size={24} />
                        <h3 style={{ fontSize: '22px', fontWeight: '900', color: '#1e293b' }}>REPORTED <span style={{ color: '#94a3b8' }}>POSTS</span></h3>
                    </div>
                    {reportedPosts.length === 0 ? (
                        <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '700' }}>No reports pending.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left' }}>
                                        <th style={{ padding: '15px', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>REASON / BLOG TITLE</th>
                                        <th style={{ padding: '15px', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>REPORTED BY</th>
                                        <th style={{ padding: '15px', textAlign: 'right', color: '#94a3b8', fontSize: '11px', fontWeight: '900' }}>ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportedPosts.map(r => (
                                        <tr key={r.id} style={{ background: '#fef2f2', borderRadius: '15px' }}>
                                            <td style={{ padding: '20px', fontWeight: '800', color: '#b91c1c', borderRadius: '15px 0 0 15px' }}>
                                                {r.reason} <br /><span style={{ color: '#94a3b8', fontSize: '10px', fontWeight: '500' }}>Post: {r.blogPostTitle} (by {r.blogPostAuthor})</span>
                                            </td>
                                            <td style={{ padding: '20px' }}>
                                                <span style={{ padding: '6px 14px', borderRadius: '10px', fontSize: '10px', fontWeight: '900', background: '#ffe4e6', color: '#e11d48' }}>
                                                    {r.reportedBy}
                                                </span>
                                            </td>
                                            <td style={{ padding: '20px', textAlign: 'right', borderRadius: '0 15px 15px 0', gap: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleResolveReport(r.id)} style={{ background: '#cbd5e1', color: '#334155', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>IGNORE / RESOLVE</button>
                                                <button onClick={() => handleDeletePost(r.blogPostId)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>DELETE POST</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;