import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Award, Calendar, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { assignTrainer } from '../../api/trainerApi';

const TrainerCard = ({ trainer }) => {
    const navigate = useNavigate();
    const [isBooking, setIsBooking] = useState(false);
    const {
        id,
        username,
        fullName,
        specializations,
        experienceYears,
        profileImage,
        isAvailable
    } = trainer;

    const handleBooking = async () => {
        if (!isAvailable) return;
        const confirmBook = window.confirm(`Are you sure you want to book ${fullName || username} as your coach?`);
        if (confirmBook) {
            try {
                setIsBooking(true);
                await assignTrainer(id);
                alert(`Successfully assigned! ${fullName || username} is now your coach.`);
                navigate('/dashboard');
            } catch (error) {
                console.error("Booking error:", error);
                alert("Failed to assign trainer. You might already have a booking or there was a server error.");
            } finally {
                setIsBooking(false);
            }
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            style={{
                background: 'white', borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                display: 'flex', flexDirection: 'column', height: '100%'
            }}
        >
            {/* Profile Image / Banner */}
            <div style={{ position: 'relative', height: '180px', background: '#f8fafc', overflow: 'hidden' }}>
                {profileImage ? (
                    <img
                        src={profileImage}
                        alt={username}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#cbd5e1' }}>
                        <User size={64} />
                    </div>
                )}

                {/* Availability Badge */}
                <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: isAvailable ? 'rgba(20, 184, 166, 0.9)' : 'rgba(244, 63, 94, 0.9)',
                    color: 'white', backdropFilter: 'blur(4px)'
                }}>
                    {isAvailable ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {isAvailable ? 'AVAILABLE' : 'BUSY'}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{fullName || username}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#14b8a6', fontSize: '12px', fontWeight: 700 }}>
                        <Award size={14} /> Certified Professional
                    </div>
                </div>

                {/* Specializations */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1.25rem' }}>
                    {specializations?.map((spec, index) => (
                        <span
                            key={index}
                            style={{
                                padding: '4px 10px', background: '#f1f5f9', color: '#64748b',
                                fontSize: '10px', fontWeight: 700, borderRadius: '8px',
                                textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}
                        >
                            {spec}
                        </span>
                    ))}
                </div>

                {/* Experience */}
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '13px' }}>
                    <Calendar size={14} />
                    <span>{experienceYears || 5}+ Years Experience</span>
                </div>
            </div>

            {/* Actions */}
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <Link
                    to={`/trainer-profile/${id}`}
                    style={{
                        textDecoration: 'none', textAlign: 'center', padding: '10px',
                        borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b',
                        fontSize: '13px', fontWeight: 700, transition: '0.2s',
                        background: 'white'
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = '#e2e8f0'; }}
                >
                    Profile
                </Link>
                <button
                    onClick={handleBooking}
                    disabled={!isAvailable || isBooking}
                    style={{
                        padding: '10px', borderRadius: '12px', border: 'none',
                        background: isAvailable ? '#0f172a' : '#f1f5f9',
                        color: isAvailable ? 'white' : '#cbd5e1',
                        fontSize: '13px', fontWeight: 700, cursor: isAvailable ? 'pointer' : 'not-allowed',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                >
                    {isBooking ? 'Booking...' : 'Book Now'} <ChevronRight size={14} />
                </button>
            </div>
        </motion.div>
    );
};

export default TrainerCard;
