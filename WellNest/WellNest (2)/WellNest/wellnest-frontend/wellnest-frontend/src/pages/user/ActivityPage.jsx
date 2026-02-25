// src/pages/user/ActivityPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  CheckCircle2,
  Clock,
  Flame,
  ChevronRight,
  X,
  Trophy,
  TrendingUp,
  CalendarDays,
  Dumbbell,
  ChevronLeft
} from 'lucide-react';
import api from '../../api/axios';
import { getLatestWeeklyPlan, completeWorkout } from '../../api/userApi';

const ActivityPage = () => {
  const [workouts, setWorkouts] = useState([]);
  const [planWorkouts, setPlanWorkouts] = useState([]);
  
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [loading, setLoading] = useState(true);
  const [logModal, setLogModal] = useState(null);
  const [actualReps, setActualReps] = useState('');

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [adhocRes, planRes] = await Promise.all([
        api.get(`/api/user/workouts?date=${selectedDate}`),
        getLatestWeeklyPlan().catch(() => ({ data: null }))
      ]);

      setWorkouts(adhocRes.data || []);

      if (planRes.data && planRes.data.workouts) {
        const mappedPlan = planRes.data.workouts
          .filter(w => {
            if (!w.workoutDate) return false;
            const wDateStr = Array.isArray(w.workoutDate)
              ? `${w.workoutDate[0]}-${String(w.workoutDate[1]).padStart(2, '0')}-${String(w.workoutDate[2]).padStart(2, '0')}`
              : String(w.workoutDate).split('T')[0];
            return wDateStr === selectedDate;
          })
          .map(w => ({ ...w, isPlan: true, id: w.id }));
        setPlanWorkouts(mappedPlan);
      } else {
        setPlanWorkouts([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    try {
      if (logModal.isPlan) {
        await completeWorkout(logModal.id);
      } else {
        if (!actualReps) return;
        await api.post(`/api/user/workouts/${logModal.id}/log?actualReps=${actualReps}&completed=true`);
      }
      setActualReps('');
      setLogModal(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const relevantWorkouts = [...planWorkouts, ...workouts];
  const progress = useMemo(() => {
    if (!relevantWorkouts.length) return 0;
    const completed = relevantWorkouts.filter(w => w.completed).length;
    return Math.round((completed / relevantWorkouts.length) * 100);
  }, [relevantWorkouts]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '1.5rem', paddingBottom: '6rem' }}>
      
      {/* 📅 DATE SELECTOR MODULE */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>
            Daily <span style={{ color: '#14b8a6' }}>Activity</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>Track Your Workout Performance</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '8px 15px', borderRadius: '18px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
          <CalendarDays size={18} color="#14b8a6" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ border: 'none', outline: 'none', fontWeight: 'bold', color: '#1e293b', fontSize: '0.95rem', cursor: 'pointer' }}
          />
        </div>
      </header>

      {/* 🏆 MILESTONE: PERFORMANCE INSIGHT MODULE */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        style={{ padding: "1.8rem", borderRadius: "28px", background: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", marginBottom: "1.5rem" }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: '#fff7ed', borderRadius: '10px' }}><Trophy size={22} color="#f97316" /></div>
            <div>
              <span style={{ fontWeight: "800", color: "#334155", fontSize: '1.1rem' }}>Weekly Completion Insight</span>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Based on completed workouts vs assigned workouts</p>
            </div>
          </div>
          <span style={{ fontSize: "1.8rem", fontWeight: "900", color: "#14b8a6" }}>{progress}%</span>
        </div>
      </motion.div>

      {/* 📈 ACTIVITY PROGRESS MODULE */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ padding: "1.8rem", borderRadius: "28px", background: "white", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", border: "1px solid #f1f5f9", marginBottom: "2.5rem" }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ padding: '8px', background: '#f0f9ff', borderRadius: '10px' }}><TrendingUp size={22} color="#0ea5e9" /></div>
            <span style={{ fontWeight: "800", color: "#334155", fontSize: '1.1rem' }}>Activity Progress</span>
          </div>
          <span style={{ fontWeight: "900", color: "#6366f1" }}>{progress}%</span>
        </div>
        
        <div style={{ height: '12px', background: '#f1f5f9', borderRadius: '20px', overflow: 'hidden' }}>
          <motion.div 
            initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #14b8a6, #6366f1)', borderRadius: '20px' }} 
          />
        </div>
      </motion.div>

      {/* 🏋️ WORKOUT LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        {loading ? (
           <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontWeight: 'bold' }}>Booting up your session...</div>
        ) : relevantWorkouts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: '4rem 2rem', textAlign: 'center', background: 'white', borderRadius: '32px', border: '2px dashed #e2e8f0' }}
          >
            <Activity size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: '800', color: '#475569', fontSize: '1.2rem' }}>No workouts assigned or logged</h3>
            <p style={{ color: '#94a3b8', marginTop: '5px' }}>Check back later or change the date!</p>
          </motion.div>
        ) : (
          relevantWorkouts.map((workout, idx) => (
            <motion.div
              key={`${workout.isPlan ? 'plan' : 'adhoc'}-${workout.id}`}
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}
              style={{
                padding: '1.5rem', borderRadius: '26px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9",
                borderLeft: workout.completed ? '8px solid #22c55e' : (workout.isPlan ? '8px solid #6366f1' : '8px solid #14b8a6')
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                <div style={{ 
                  width: '55px', height: '55px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: workout.completed ? '#f0fdf4' : '#f8fafc'
                }}>
                  {workout.completed ? <CheckCircle2 color="#22c55e" size={26} /> : <Dumbbell color={workout.isPlan ? "#6366f1" : "#14b8a6"} size={26} />}
                </div>
                
                <div>
                  <h3 style={{ fontWeight: '800', fontSize: '1.15rem', color: workout.completed ? '#94a3b8' : '#1e293b', textDecoration: workout.completed ? 'line-through' : 'none' }}>
                    {workout.workoutName}
                    {workout.isPlan && <span style={{ marginLeft: '10px', fontSize: '10px', padding: '3px 10px', background: '#e0e7ff', color: '#4338ca', borderRadius: '12px', fontWeight: '900' }}>PLAN</span>}
                  </h3>
                  <div style={{ display: 'flex', gap: '15px', marginTop: '6px' }}>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}><Clock size={14}/> {workout.targetTime || 'Anytime'}</span>
                    <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600' }}><Flame size={14}/> {workout.targetReps} Reps</span>
                  </div>
                </div>
              </div>

              {!workout.completed ? (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setLogModal(workout)}
                  style={{ 
                    padding: '12px 24px', borderRadius: '15px', border: 'none', 
                    background: workout.isPlan ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'linear-gradient(135deg, #14b8a6, #0d9488)', 
                    color: 'white', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                >
                  {workout.isPlan ? 'Complete' : 'Log'}
                </motion.button>
              ) : (
                <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '50%' }}><CheckCircle2 color="#22c55e" size={20} /></div>
              )}
            </motion.div>
          ))
        )}
      </div>

      {/* 🎯 LOG MODAL */}
      <AnimatePresence>
        {logModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
            >
              <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#0f172a', marginBottom: '10px' }}>{logModal.workoutName}</h3>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>{logModal.isPlan ? 'Did you finish this workout?' : 'How many reps did you do?'}</p>

              {!logModal.isPlan && (
                <input
                  type="number"
                  value={actualReps}
                  onChange={(e) => setActualReps(e.target.value)}
                  placeholder="0"
                  style={{ width: '100%', padding: '15px', borderRadius: '16px', border: '2px solid #f1f5f9', fontSize: '1.8rem', textAlign: 'center', fontWeight: '900', outline: 'none', marginBottom: '20px' }}
                />
              )}

              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setLogModal(null)} style={{ flex: 1, padding: '14px', borderRadius: '14px', border: 'none', background: '#f1f5f9', fontWeight: '700', cursor: 'pointer' }}>Cancel</button>
                <button onClick={handleLog} style={{ flex: 2, padding: '14px', borderRadius: '14px', border: 'none', background: '#14b8a6', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Save</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityPage;