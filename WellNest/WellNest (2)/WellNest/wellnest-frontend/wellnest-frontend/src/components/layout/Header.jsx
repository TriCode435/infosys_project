import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown, Bell, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    if (!user) return null;

    return (
        <header style={{
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            {/* Logo */}
            <div
                onClick={() => navigate('/')}
                style={{
                    cursor: 'pointer',
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#0f172a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)', borderRadius: '8px' }}></div>
                Well<span style={{ color: '#14b8a6' }}>Nest</span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: '#f1f5f9', borderRadius: '100px', width: '250px' }} className="hide-mobile">
                    <Search size={18} color="#64748b" />
                    <input type="text" placeholder="Search features..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: '14px', width: '100%' }} />
                </div>

                <div style={{ position: 'relative', cursor: 'pointer' }}>
                    <Bell size={22} color="#64748b" />
                    <div style={{ position: 'absolute', top: -2, right: -2, width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%', border: '2px solid #fff' }}></div>
                </div>

                {/* Profile Dropdown */}
                <div style={{ position: 'relative' }}>
                    <div
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            transition: 'background 0.2s',
                            background: isDropdownOpen ? '#f1f5f9' : 'transparent'
                        }}
                    >
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #14b8a6 0%, #6366f1 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '14px'
                        }}>
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="hide-mobile" style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', lineHeight: 1 }}>{user?.username || 'User'}</span>
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{user?.role || 'Member'}</span>
                        </div>
                        <ChevronDown size={16} color="#64748b" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>

                    <AnimatePresence>
                        {isDropdownOpen && (
                            <>
                                <div
                                    onClick={() => setIsDropdownOpen(false)}
                                    style={{ position: 'fixed', inset: 0, zIndex: -1 }}
                                />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    style={{
                                        position: 'absolute',
                                        top: 'calc(100% + 10px)',
                                        right: 0,
                                        width: '220px',
                                        background: '#fff',
                                        borderRadius: '16px',
                                        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                                        border: '1px solid rgba(0,0,0,0.05)',
                                        overflow: 'hidden',
                                        padding: '8px'
                                    }}
                                >
                                    {[
                                        { icon: <User size={18} />, label: 'My Profile', path: '/profile' },
                                        { icon: <Settings size={18} />, label: 'Account Settings', path: '/profile' },
                                    ].map(item => (
                                        <div
                                            key={item.label}
                                            onClick={() => { navigate(item.path); setIsDropdownOpen(false); }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '12px',
                                                padding: '10px 12px',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                transition: 'background 0.2s',
                                                color: '#1e293b',
                                                fontSize: '14px',
                                                fontWeight: 600
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            {item.icon}
                                            {item.label}
                                        </div>
                                    ))}
                                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '8px 4px' }}></div>
                                    <div
                                        onClick={logout}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            padding: '10px 12px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            transition: 'background 0.2s',
                                            color: '#ef4444',
                                            fontSize: '14px',
                                            fontWeight: 600
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>
                {`
                    @media (max-width: 768px) {
                        .hide-mobile { display: none !important; }
                    }
                `}
            </style>
        </header>
    );
};

export default Header;
