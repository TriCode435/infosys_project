import React, { useState, useEffect } from "react";
import { Users, Activity, TrendingUp, Search, LogOut, User, Flame, CalendarDays, PlusCircle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { createBlogPost } from "../../api/userApi";
import { Link } from "react-router-dom";

const TrainerDashboard = ({ viewedTrainer }) => {
  const { user, logout } = useAuth();
  const activeTrainer = viewedTrainer || user;
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({ activeClients: 0, totalAssignments: 0, completionRate: 0 });
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [blogData, setBlogData] = useState({ title: '', content: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try { await Promise.all([fetchAssignedUsers(), fetchStats()]); }
    finally { setLoading(false); }
  };

  const fetchAssignedUsers = async () => {
    try {
      const endpoint = viewedTrainer
        ? `/api/admin/trainers/${viewedTrainer.id}/assigned-users`
        : "/api/trainer/assigned-users";
      const res = await api.get(endpoint);
      setAssignedUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchStats = async () => {
    try {
      const endpoint = viewedTrainer
        ? `/api/admin/trainers/${viewedTrainer.id}/stats`
        : "/api/trainer/stats";
      const res = await api.get(endpoint);
      setStats(res.data);
    } catch (err) { console.error(err); }
  };

  const handlePublishBlog = async (e) => {
    e.preventDefault();
    try {
      await createBlogPost(blogData);
      alert("Article published!");
      setShowBlogModal(false);
      setBlogData({ title: '', content: '' });
    } catch (err) { alert("Failed to publish"); }
  };

  const filteredUsers = assignedUsers.filter((u) =>
    (u.fullName || u.username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cardStyle = {
    background: 'white',
    borderRadius: '24px',
    padding: '24px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', color: '#6366f1' }}>LOADING COACH CONSOLE...</div>;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

        {/* HEADER */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '900', color: '#0f172a', margin: 0, letterSpacing: '-1px' }}>
              COACH <span style={{ color: '#6366f1', fontStyle: 'italic' }}>DASHBOARD</span>
            </h1>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '2px', marginTop: '4px' }}>
              Managing {assignedUsers.length} Elite Athletes
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {!viewedTrainer && (
              <>
                <button
                  onClick={() => setShowBlogModal(true)}
                  style={{ background: '#6366f1', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '14px', fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)' }}
                >
                  <PlusCircle size={16} /> PUBLISH ARTICLE
                </button>
                <button onClick={logout} style={{ background: 'white', border: '1px solid #e2e8f0', padding: '12px', borderRadius: '14px', cursor: 'pointer', color: '#ef4444' }}>
                  <LogOut size={20} />
                </button>
              </>
            )}
          </div>
        </header>

        {/* STATS SECTION */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
          <div style={{ ...cardStyle, background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Users size={24} />
              <span style={{ fontSize: '10px', fontWeight: '900', opacity: 0.8 }}>ACTIVE ATHLETES</span>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '900' }}>{stats.activeClients}</div>
          </div>
          <div style={{ ...cardStyle, background: 'white', borderLeft: '6px solid #10b981' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
              <Activity size={24} />
              <span style={{ fontSize: '10px', fontWeight: '900', color: '#64748b' }}>TOTAL PLANS</span>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '900', color: '#0f172a' }}>{stats.totalAssignments}</div>
          </div>
          <div style={{ ...cardStyle, background: '#0f172a', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <TrendingUp size={24} color="#6366f1" />
              <span style={{ fontSize: '10px', fontWeight: '900', opacity: 0.6 }}>SUCCESS RATE</span>
            </div>
            <div style={{ fontSize: '48px', fontWeight: '900' }}>{Math.round(stats.completionRate)}%</div>
          </div>
        </div>

        {/* MEMBER ROSTER */}
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '900', margin: 0 }}>MEMBER <span style={{ color: '#6366f1' }}>DIRECTORY</span></h2>
          <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
            <Search style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input
              type="text"
              placeholder="Search athlete identity..."
              style={{ width: '100%', padding: '14px 14px 14px 45px', borderRadius: '16px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: '600', outline: 'none', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' }}>
          {filteredUsers.map((u) => (
            <motion.div whileHover={{ y: -5 }} key={u.id} style={cardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: '50px', height: '50px', background: '#f1f5f9', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1' }}>
                  <User size={28} />
                </div>
                <span style={{ fontSize: '9px', fontWeight: '900', background: '#ecfdf5', color: '#059669', padding: '4px 10px', borderRadius: '20px', border: '1px solid #d1fae5' }}>ACTIVE</span>
              </div>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '900', color: '#1e293b', margin: '0 0 4px 0' }}>{u.fullName || u.username}</h3>
                <p style={{ fontSize: '10px', fontWeight: '800', color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px' }}>{u.fitnessGoal || 'Performance'}</p>
              </div>

              <div style={{ display: 'flex', gap: '20px', padding: '15px 0', borderTop: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Flame size={16} color="#f97316" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>{Math.round(u.currentWeight || 0)}kg</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays size={16} color="#6366f1" />
                  <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>{u.lastActivityDate || 'No Logs'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                {!viewedTrainer ? (
                  <>
                    <Link to={`/trainer/user-details/${u.id}`} style={{ flex: 1, textDecoration: 'none', textAlign: 'center', padding: '12px', borderRadius: '12px', background: '#f8fafc', color: '#64748b', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>Edit Plan</Link>
                    <Link to={`/trainer/athlete-insight/${u.id}`} style={{ flex: 1.2, textDecoration: 'none', textAlign: 'center', padding: '12px', borderRadius: '12px', background: '#0f172a', color: 'white', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      Insights <Zap size={12} fill="white" />
                    </Link>
                  </>
                ) : (
                  <div style={{ flex: 1, textAlign: 'center', padding: '12px', borderRadius: '12px', background: '#f8fafc', color: '#94a3b8', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase' }}>
                    View Only
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ARTICLE MODAL */}
      <AnimatePresence>
        {showBlogModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'white', width: '100%', maxWidth: '600px', borderRadius: '32px', padding: '40px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              <h2 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '30px', color: '#0f172a' }}>POST <span style={{ color: '#6366f1' }}>EXPERT CONTENT</span></h2>
              <form onSubmit={handlePublishBlog} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>ARTICLE TITLE</label>
                  <input required style={{ width: '100%', padding: '15px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600' }} placeholder="e.g. Science of Recovery" value={blogData.title} onChange={(e) => setBlogData({ ...blogData, title: e.target.value })} />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>ARTICLE CONTENT</label>
                  <textarea required style={{ width: '100%', padding: '15px', borderRadius: '14px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', minHeight: '150px' }} placeholder="Share your wisdom..." value={blogData.content} onChange={(e) => setBlogData({ ...blogData, content: e.target.value })} />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setShowBlogModal(false)} style={{ flex: 1, padding: '16px', borderRadius: '16px', border: 'none', background: '#f1f5f9', fontWeight: '800', cursor: 'pointer', color: '#64748b' }}>CANCEL</button>
                  <button type="submit" style={{ flex: 2, padding: '16px', borderRadius: '16px', border: 'none', background: '#6366f1', color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)' }}>PUBLISH TO COMMUNITY</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainerDashboard;