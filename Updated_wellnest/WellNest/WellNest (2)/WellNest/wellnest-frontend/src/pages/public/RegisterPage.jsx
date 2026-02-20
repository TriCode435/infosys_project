import React, { useState } from 'react';
import { User, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '', email: '', password: '', role: 'USER'
    });
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await register(formData.username, formData.email, formData.password, formData.role);
            if (result.success) {
                alert("Registration successful! Please login.");
                navigate('/login');
            } else {
                // If message is an object (validation errors), format it
                const msg = typeof result.message === 'object'
                    ? Object.entries(result.message).map(([k, v]) => `${k}: ${v}`).join('\n')
                    : result.message;
                alert(msg || "Registration failed. Please check your details.");
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred. Please try again later.");
        }
    };

    return (
        <div style={{
            minHeight: 'calc(100vh - 100px)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
                style={{ width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden' }}
            >
                <div className="gradient-bg" style={{ padding: '3rem', color: 'white', textAlign: 'center' }}>
                    <div style={{
                        width: '4rem', height: '4rem', background: 'white',
                        borderRadius: '1.25rem', margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                    }}>
                        <UserPlus className="text-primary" size={32} />
                    </div>
                    <h1 className="font-black tracking-tight" style={{ fontSize: '2rem' }}>Join WellNest</h1>
                    <p style={{ opacity: 0.8, fontWeight: 500, fontStyle: 'italic' }}>Start your fitness journey today</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Role Selector */}
                    <div style={{ display: 'flex', background: '#f8fafc', padding: '0.375rem', borderRadius: '1rem', marginBottom: '0.5rem' }}>
                        {['USER', 'TRAINER'].map(r => (
                            <button
                                key={r}
                                type="button"
                                onClick={() => setFormData({ ...formData, role: r })}
                                style={{
                                    flex: 1, padding: '0.75rem', border: 'none',
                                    borderRadius: '0.75rem', fontWeight: 900, fontSize: '12px',
                                    textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s ease',
                                    background: formData.role === r ? 'white' : 'transparent',
                                    color: formData.role === r ? 'var(--primary)' : '#94a3b8',
                                    boxShadow: formData.role === r ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                                }}
                            >
                                {r === 'USER' ? 'Member' : 'Trainer'}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '10px', marginLeft: '0.25rem' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '3.5rem' }}
                                placeholder="your_username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '10px', marginLeft: '0.25rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="email"
                                className="input-field"
                                style={{ paddingLeft: '3.5rem' }}
                                placeholder="name@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '10px', marginLeft: '0.25rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '3.5rem' }}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '1.25rem', fontSize: '14px', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Get Started <ArrowRight size={20} className="ml-2" />
                    </button>

                    <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'none' }}>Login</Link>
                    </p>
                </form>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
