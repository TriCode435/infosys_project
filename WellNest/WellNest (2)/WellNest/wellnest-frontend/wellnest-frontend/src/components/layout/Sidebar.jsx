import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Activity,
    Utensils,
    Calculator,
    User,
    Calendar,
    Users,
    Search,
    Shield,
    FileText,
    Home,
    Menu,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = () => {
    const { user } = useAuth();
    const location = useLocation();
    const [isOpen, setIsOpen] = React.useState(true);

    if (!user) return null;

    const role = user.role;

    const menuItems = [
        // Shared/Common
        { icon: <Home size={20} />, label: 'Home', path: '/', roles: ['USER', 'ADMIN'] },

        // User Specific
        { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard', roles: ['USER'] },
        { icon: <Activity size={20} />, label: 'Activity', path: '/activity', roles: ['USER'] },
        { icon: <Utensils size={20} />, label: 'Nutrition', path: '/nutrition', roles: ['USER'] },
        { icon: <Calculator size={20} />, label: 'BMI Analysis', path: '/bmi', roles: ['USER'] },
        { icon: <Calendar size={20} />, label: 'Weekly Plan', path: '/weekly-plan', roles: ['USER'] },
        { icon: <Users size={20} />, label: 'Community', path: '/community', roles: ['USER', 'TRAINER'] },
        { icon: <Search size={20} />, label: 'Find Trainer', path: '/find-trainer', roles: ['USER'] },

        // Trainer Specific
        { icon: <LayoutDashboard size={20} />, label: 'Trainer Portal', path: '/trainer/dashboard', roles: ['TRAINER'] },
        { icon: <Calendar size={20} />, label: 'Assign Weekly Plan', path: '/trainer/assign-plan', roles: ['TRAINER'] },

        // Admin Specific
        { icon: <Shield size={20} />, label: 'Admin Core', path: '/admin/dashboard', roles: ['ADMIN'] },
        { icon: <FileText size={20} />, label: 'Moderation', path: '/admin/blog', roles: ['ADMIN'] },

        // Shared Blog
        { icon: <FileText size={20} />, label: 'Read Blog', path: '/blog', roles: ['USER', 'TRAINER', 'ADMIN'] },
        { icon: <User size={20} />, label: 'My Profile', path: '/profile', roles: ['USER', 'TRAINER', 'ADMIN'] },
    ];

    const filteredItems = menuItems.filter(item => item.roles.includes(role));

    const sidebarVariants = {
        open: { width: '280px', transition: { type: 'spring', stiffness: 300, damping: 30 } },
        closed: { width: '80px', transition: { type: 'spring', stiffness: 300, damping: 30 } }
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '24px',
                    left: '24px',
                    zIndex: 1100,
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: '#0f172a',
                    color: '#fff',
                    display: 'none', // Shown via media query
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                    cursor: 'pointer'
                }}
                className="sidebar-toggle"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <motion.aside
                initial="open"
                animate={isOpen ? "open" : "closed"}
                variants={sidebarVariants}
                style={{
                    height: '100vh',
                    background: '#fff',
                    borderRight: '1px solid rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000,
                    overflow: 'hidden'
                }}
                className="sidebar-main"
            >
                {/* Brand / Logo Area */}
                <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', gap: '12px', overflow: 'hidden' }}>
                    <div style={{ minWidth: '32px', height: '32px', background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)', borderRadius: '8px', flexShrink: 0 }}></div>
                    {isOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', whiteSpace: 'nowrap' }}
                        >
                            Well<span style={{ color: '#14b8a6' }}>Nest</span>
                        </motion.span>
                    )}
                </div>

                {/* Navigation Links */}
                <nav style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', overflowX: 'hidden' }}>
                    {filteredItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px',
                                    padding: '12px 16px',
                                    borderRadius: '12px',
                                    textDecoration: 'none',
                                    color: isActive ? '#14b8a6' : '#64748b',
                                    background: isActive ? '#f0fdfa' : 'transparent',
                                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    fontWeight: isActive ? 700 : 600,
                                    fontSize: '14px',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = '#f8fafc';
                                        e.currentTarget.style.color = '#1e293b';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = '#64748b';
                                    }
                                }}
                            >
                                <div style={{ minWidth: '20px', display: 'flex', justifyContent: 'center' }}>
                                    {item.icon}
                                </div>
                                {isOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Info */}
                <div style={{ padding: '24px', borderTop: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            minWidth: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#f1f5f9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 800,
                            color: '#6366f1',
                            flexShrink: 0
                        }}>
                            {user.username?.charAt(0).toUpperCase()}
                        </div>
                        {isOpen && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ overflow: 'hidden' }}>
                                <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName || user.username}</p>
                                <p style={{ margin: 0, fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user.role}</p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.aside>

            <style>
                {`
                    @media (max-width: 1024px) {
                        .sidebar-main {
                            position: fixed !important;
                            left: 0;
                            height: 100vh;
                            box-shadow: 20px 0 40px rgba(0,0,0,0.1);
                            transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
                            transition: transform 0.3s ease-in-out !important;
                        }
                        .sidebar-toggle { display: flex !important; }
                    }
                `}
            </style>
        </>
    );
};

export default Sidebar;
