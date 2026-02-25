import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTrainerProfileById, assignTrainer } from '../../api/trainerApi';
import { User, ChevronLeft, Award, CheckCircle } from 'lucide-react';

const TrainerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const { data } = await getTrainerProfileById(id);
                setTrainer(data);
            } catch (err) {
                console.error('Error fetching trainer profile:', err);
                setError('Trainer profile not found.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleBooking = async () => {
        if (!trainer?.isAvailable) return;
        const confirmBook = window.confirm(`Are you sure you want to book ${trainer.fullName || trainer.username} as your coach?`);
        if (confirmBook) {
            try {
                setIsBooking(true);
                await assignTrainer(trainer.id);
                alert(`Successfully assigned! ${trainer.fullName || trainer.username} is now your coach.`);
                navigate('/dashboard');
            } catch (error) {
                console.error("Booking error:", error);
                alert("Failed to assign trainer. You might already have a booking or there was a server error.");
            } finally {
                setIsBooking(false);
            }
        }
    };

    if (loading) return (
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', color: '#0095f6', fontWeight: 'bold' }}>
            LOADING SPECIALIST...
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '16px' }}>{error}</h2>
            <button onClick={() => navigate('/find-trainer')} style={{ color: '#0095f6', fontWeight: '700', background: 'none', border: 'none', cursor: 'pointer' }}>Back to Search</button>
        </div>
    );

    return (
        <div className="instagram-scoped" style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
            <div style={{ maxWidth: '935px', margin: '0 auto', padding: '30px 20px' }}>

                {/* Back Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', color: '#8e8e8e' }} onClick={() => navigate('/find-trainer')}>
                    <ChevronLeft size={20} />
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Back to Search</span>
                </div>

                <div style={{ background: '#fff', border: '1px solid #efefef', borderRadius: '12px', padding: '44px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    {/* Header */}
                    <header style={{ display: 'flex', gap: '40px', marginBottom: '44px', flexWrap: 'wrap' }}>
                        <div style={{ flex: '0 0 150px' }}>
                            <div style={{
                                width: '150px',
                                height: '150px',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                border: '1px solid #dbdbdb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {trainer.profileImage ? (
                                    <img src={trainer.profileImage} alt={trainer.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <User size={80} color="#dbdbdb" />
                                )}
                            </div>
                        </div>

                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                                <h1 style={{ fontSize: '28px', fontWeight: 300 }}>{trainer.fullName || trainer.username}</h1>
                                <button
                                    onClick={handleBooking}
                                    disabled={!trainer.isAvailable || isBooking}
                                    style={{
                                        padding: '5px 15px',
                                        borderRadius: '4px',
                                        border: '1px solid #dbdbdb',
                                        background: trainer.isAvailable ? '#0095f6' : '#efefef',
                                        color: trainer.isAvailable ? '#fff' : '#8e8e8e',
                                        fontWeight: 600,
                                        fontSize: '14px',
                                        cursor: trainer.isAvailable ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    {isBooking ? 'Booking...' : (trainer.isAvailable ? 'Book Session' : 'Fully Booked')}
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '40px', marginBottom: '20px', fontSize: '16px' }}>
                                <div><strong>{trainer.experienceYears || '5+'}</strong> years exp</div>
                                <div><strong>${trainer.pricePerSession || '50'}</strong> / session</div>
                                <div><strong>100%</strong> dedication</div>
                            </div>

                            <div>
                                <div style={{ fontWeight: 600, fontSize: '16px' }}>WellNest Certified Specialist</div>
                                <div style={{ marginTop: '10px', fontSize: '14px', color: '#262626', lineHeight: '1.5' }}>
                                    {trainer.bio || "Expert guidance for your fitness journey."}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Expertise Section */}
                    <div style={{ borderTop: '1px solid #dbdbdb', paddingTop: '32px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: 600, color: '#8e8e8e', textTransform: 'uppercase', marginBottom: '24px', letterSpacing: '1px', textAlign: 'center' }}>Expertise & Focus</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                            {trainer.specializations?.map((spec, index) => (
                                <span key={index} style={{ padding: '8px 20px', backgroundColor: '#fafafa', border: '1px solid #dbdbdb', borderRadius: '8px', fontSize: '13px', fontWeight: 600, color: '#262626' }}>
                                    #{spec.toLowerCase().replace(/\s+/g, '')}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Booking Section */}
                    <div style={{ marginTop: '60px', textAlign: 'center', background: '#fafafa', padding: '48px', borderRadius: '16px', border: '1px solid #efefef' }}>
                        <div style={{ color: '#0095f6', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                            <Award size={40} />
                        </div>
                        <h3 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '16px' }}>Start Your Journey Together</h3>
                        <p style={{ color: '#8e8e8e', fontSize: '15px', marginBottom: '32px', maxWidth: '500px', margin: '0 auto 32px' }}>
                            Reserve a coaching slot and get a personalized plan tailored to your #1 goal. No upfront payment required for the initial assessment.
                        </p>
                        <button
                            onClick={handleBooking}
                            disabled={!trainer.isAvailable || isBooking}
                            style={{
                                padding: '16px 40px',
                                borderRadius: '8px',
                                background: trainer.isAvailable ? '#0095f6' : '#efefef',
                                color: '#fff',
                                fontWeight: '700',
                                fontSize: '16px',
                                border: 'none',
                                cursor: trainer.isAvailable ? 'pointer' : 'not-allowed',
                                boxShadow: trainer.isAvailable ? '0 8px 20px rgba(0, 149, 246, 0.3)' : 'none',
                                transition: 'opacity 0.2s ease'
                            }}
                        >
                            {isBooking ? 'Completing Request...' : (trainer.isAvailable ? 'Confirm My Reservation' : 'Join the Waiting List')}
                        </button>
                        <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#14b8a6', fontSize: '13px', fontWeight: '600' }}>
                            <CheckCircle size={16} /> 100% Satisfaction Guarantee
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainerProfile;
