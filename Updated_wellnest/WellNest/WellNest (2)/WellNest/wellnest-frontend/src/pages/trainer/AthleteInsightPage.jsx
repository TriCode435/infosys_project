import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import UserDashboard from '../user/UserDashboard';
import { ArrowLeft } from 'lucide-react';
import api from '../../api/axios';

const AthleteInsightPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [athlete, setAthlete] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAthlete = async () => {
            try {
                const res = await api.get(`/api/trainer/users/${userId}/profile`);
                setAthlete(res.data);
            } catch (err) {
                console.error("Failed to fetch athlete", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAthlete();
    }, [userId]);

    if (loading) return <div className="p-10 text-center">Loading Athlete Data...</div>;

    return (
        <div style={{ background: 'var(--bg-app)', minHeight: '100vh' }}>
            <div style={{ padding: '1rem', background: 'white', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)' }}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="font-black" style={{ fontSize: '1rem' }}>
                    Insight: {athlete ? athlete.username : 'User'}
                </h1>
            </div>
            <div style={{ padding: '1rem' }}>
                {athlete && <UserDashboard viewedUser={athlete} />}
            </div>
        </div>
    );
};

export default AthleteInsightPage;
