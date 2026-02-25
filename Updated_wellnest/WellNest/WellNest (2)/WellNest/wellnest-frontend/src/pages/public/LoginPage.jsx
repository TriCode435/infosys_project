import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '', role: 'USER' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await login(credentials.username, credentials.password, credentials.role);
            if (result.success) {
                if (credentials.role === 'ADMIN') navigate('/admin/dashboard');
                else if (credentials.role === 'TRAINER') navigate('/trainer/dashboard');
                else navigate('/dashboard');
            } else {
                alert(result.message);
            }
        } catch (err) {
            console.error(err);
            alert("Login failed. Check credentials and role.");
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
                style={{ width: '100%', maxWidth: '450px', padding: 0, overflow: 'hidden' }}
            >
                <div className="gradient-bg" style={{ padding: '3rem', color: 'white', textAlign: 'center' }}>
                    <div style={{
                        width: '4rem', height: '4rem', background: 'white',
                        borderRadius: '1.25rem', margin: '0 auto 1.5rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
                    }}>
                        <Activity className="text-primary" size={32} />
                    </div>
                    <h1 className="font-black tracking-tight" style={{ fontSize: '2rem' }}>Welcome Back</h1>
                    <p style={{ opacity: 0.8, fontWeight: 500, fontStyle: 'italic' }}>Continue your fitness journey</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '10px', marginLeft: '0.25rem' }}>Login As</label>
                        <select
                            className="input-field"
                            value={credentials.role}
                            onChange={(e) => setCredentials({ ...credentials, role: e.target.value })}
                            required
                        >
                            <option value="USER">Member</option>
                            <option value="TRAINER">Trainer</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '10px', marginLeft: '0.25rem' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                className="input-field"
                                style={{ paddingLeft: '3.5rem' }}
                                placeholder="your.username"
                                value={credentials.username}
                                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <label className="text-slate-500 font-black uppercase tracking-widest" style={{ fontSize: '10px', marginLeft: '0.25rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="password"
                                className="input-field"
                                style={{ paddingLeft: '3.5rem' }}
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ padding: '1.25rem', fontSize: '14px', marginTop: '1rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Login <ArrowRight size={20} className="ml-2" />
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <p className="text-slate-400 font-medium" style={{ fontSize: '14px' }}>
                            New here? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 900, textDecoration: 'none' }}>Create Account</Link>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default LoginPage;
