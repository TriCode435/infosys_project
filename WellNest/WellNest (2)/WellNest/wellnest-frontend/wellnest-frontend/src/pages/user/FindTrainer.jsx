import React, { useState, useEffect, useCallback } from 'react';
import { searchTrainers } from '../../api/trainerApi';
import TrainerCard from '../../components/trainer/TrainerCard';
import { Search, Filter, RotateCcw, ChevronLeft, ChevronRight, UserSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GOALS = [
    'Weight Loss',
    'Muscle Gain',
    'General Fitness',
    'Strength Training',
    'Yoga',
    'Rehabilitation'
];

const FindTrainer = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        goal: '',
        name: '',
        availableOnly: false,
        page: 0,
        size: 9,
        sort: 'experienceYears,desc'
    });
    const [totalPages, setTotalPages] = useState(0);

    const fetchTrainers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Remove empty strings so backend receives null
            const queryParams = { ...filters };
            if (!queryParams.goal) delete queryParams.goal;
            if (!queryParams.name) delete queryParams.name;

            const { data } = await searchTrainers(queryParams);
            setTrainers(data.content || []);
            setTotalPages(data.totalPages || 0);
        } catch (err) {
            console.error('Error fetching trainers:', err);
            setError('Failed to load trainers. Please try again later.');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTrainers();
    }, [fetchTrainers]);

    const handleFilterChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
            page: 0
        }));
    };

    const handleReset = () => {
        setFilters({
            goal: '',
            name: '',
            availableOnly: false,
            page: 0,
            size: 9,
            sort: 'experienceYears,desc'
        });
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', fontFamily: 'Inter, sans-serif' }}>

            {/* --- HEADER --- */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', color: '#0f172a', marginBottom: '0.5rem' }}>
                    Find Your <span style={{ color: '#14b8a6' }}>Trainer</span>
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem' }}>
                    Connect with expert coaches to reach your fitness goals.
                </p>
            </div>

            {/* --- FILTERS SECTION --- */}
            <div style={{
                background: 'white', padding: '2rem', borderRadius: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid #f1f5f9',
                marginBottom: '3rem'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', alignItems: 'flex-end' }}>

                    {/* Search by Name */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search Trainer</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Trainer name..."
                                value={filters.name}
                                onChange={handleFilterChange}
                                style={{
                                    width: '100%', padding: '12px 12px 12px 40px', borderRadius: '12px',
                                    border: '1px solid #e2e8f0', outline: 'none', background: '#f8fafc',
                                    fontSize: '14px', transition: '0.2s'
                                }}
                            />
                        </div>
                    </div>

                    {/* Goal Selection */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Fitness Goal</label>
                        <div style={{ position: 'relative' }}>
                            <select
                                name="goal"
                                value={filters.goal}
                                onChange={handleFilterChange}
                                style={{
                                    width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                    background: '#f8fafc', fontSize: '14px', color: '#64748b',
                                    outline: 'none', cursor: 'pointer', appearance: 'none'
                                }}
                            >
                                <option value="">All Specializations</option>
                                {GOALS.map(goal => (
                                    <option key={goal} value={goal}>{goal}</option>
                                ))}
                            </select>
                            <Filter size={14} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#94a3b8' }} />
                        </div>
                    </div>

                    {/* Availability Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', height: '46px' }}>
                        <div
                            onClick={() => handleFilterChange({ target: { name: 'availableOnly', type: 'checkbox', checked: !filters.availableOnly } })}
                            style={{
                                width: '44px', height: '24px', background: filters.availableOnly ? '#14b8a6' : '#e2e8f0',
                                borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.3s'
                            }}
                        >
                            <motion.div
                                animate={{ x: filters.availableOnly ? 22 : 2 }}
                                style={{
                                    width: '20px', height: '20px', background: 'white', borderRadius: '50%',
                                    position: 'absolute', top: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>Available Only</span>
                    </div>

                    {/* Reset Button */}
                    <button
                        onClick={handleReset}
                        style={{
                            height: '46px', border: 'none', background: '#f1f5f9', color: '#64748b',
                            borderRadius: '12px', fontWeight: 600, display: 'flex', alignItems: 'center',
                            justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: '0.2s'
                        }}
                    >
                        <RotateCcw size={18} /> Clear Filters
                    </button>
                </div>
            </div>

            {/* --- TRAINERS GRID --- */}
            {loading ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{ height: '400px', background: '#f1f5f9', borderRadius: '24px', animate: 'pulse 1.5s infinite' }} />
                    ))}
                </div>
            ) : trainers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#f8fafc', borderRadius: '32px', border: '2px dashed #e2e8f0' }}>
                    <UserSearch size={64} color="#cbd5e1" style={{ marginBottom: '1.5rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#64748b' }}>No trainers found</h3>
                    <p style={{ color: '#94a3b8', maxWidth: '400px', margin: '0.5rem auto 2rem auto' }}>
                        No trainers found for selected goal. Try adjusting your filters or search terms.
                    </p>
                    <button
                        onClick={handleReset}
                        style={{ background: '#14b8a6', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}
                    >
                        View All Trainers
                    </button>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {trainers.map(trainer => (
                            <TrainerCard key={trainer.id} trainer={trainer} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                            <button
                                disabled={filters.page === 0}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                                style={{
                                    padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                    background: 'white', cursor: filters.page === 0 ? 'not-allowed' : 'pointer',
                                    opacity: filters.page === 0 ? 0.5 : 1
                                }}
                            >
                                <ChevronLeft size={20} color="#64748b" />
                            </button>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                                Page {filters.page + 1} of {totalPages}
                            </span>
                            <button
                                disabled={filters.page >= totalPages - 1}
                                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                                style={{
                                    padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0',
                                    background: 'white', cursor: filters.page >= totalPages - 1 ? 'not-allowed' : 'pointer',
                                    opacity: filters.page >= totalPages - 1 ? 0.5 : 1
                                }}
                            >
                                <ChevronRight size={20} color="#64748b" />
                            </button>
                        </div>
                    )}
                </>
            )}

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: .5; }
                    }
                `}
            </style>
        </div>
    );
};

export default FindTrainer;
