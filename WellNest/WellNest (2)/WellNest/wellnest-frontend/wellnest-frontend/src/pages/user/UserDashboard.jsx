// src/pages/user/UserDashboard.jsx
import NutritionMacroChart from "../../components/charts/NutritionMacroChart";
import DailyStatsChart from "../../components/charts/DailyStatsChart";
import HealthGaugeChart from "../../components/charts/HealthGaugeChart";
import StreakRing from "../../components/charts/StreakRing";
import TrainerAnalyticsChart from "../../components/charts/TrainerAnalyticsChart";
import ActivityAreaChart from "../../components/charts/ActivityAreaChart";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Flame, Droplets, Moon, LogOut, Award, PlusCircle, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const UserDashboard = ({ viewedUser }) => {
  const { user, logout } = useAuth();
  const activeUser = viewedUser || user;
  const [viewMode, setViewMode] = useState(viewedUser ? "weekly" : "daily");
  const [stats, setStats] = useState({
    calories: 0, water: 0, workouts: 0, sleep: 0, streak: 0,
    dailyStats: [], carbs: 120, protein: 60, fats: 40
  });
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sleepModal, setSleepModal] = useState(false);
  const [sleepData, setSleepData] = useState({ sleepHours: "", mood: "Neutral", stressLevel: 5 });
  const [isSleepLogged, setIsSleepLogged] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const goals = { calories: 2000, water: 3, workouts: 1, sleep: 8 };

  const tips = [
    "Consistency beats motivation. Show up daily.",
    "Drink at least 3L of water to stay hydrated.",
    "Sleep 7-8 hours for muscle recovery.",
    "Protein supports muscle growth and fat loss.",
    "Small progress every day leads to big results."
  ];
  const randomTip = tips[new Date().getDate() % tips.length];

  const getLocalDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      const targetUser = viewedUser || user;
      if (!targetUser) return;
      setLoading(true);
      try {
        const today = new Date();
        let startDate, endDate;
        if (viewMode === "daily") {
          startDate = getLocalDate(today);
          endDate = startDate;
        } else if (viewMode === "weekly") {
          const start = new Date(today);
          const day = start.getDay();
          const diff = start.getDate() - day + (day === 0 ? -6 : 1);
          start.setDate(diff);
          const end = new Date(start);
          end.setDate(start.getDate() + 6);
          startDate = getLocalDate(start);
          endDate = getLocalDate(end);
        } else {
          const start = new Date(today.getFullYear(), today.getMonth(), 1);
          const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          startDate = getLocalDate(start);
          endDate = getLocalDate(end);
        }

        const params = { startDate, endDate };
        let dashboardData;
        if (viewedUser && (viewedUser.id || viewedUser.userId)) {
          const uid = viewedUser.id || viewedUser.userId;
          const endpoint = user?.role === 'ADMIN'
            ? `/api/admin/users/${uid}/dashboard-stats`
            : `/api/trainer/users/${uid}/dashboard-stats`;
          const res = await api.get(endpoint, { params });
          dashboardData = res.data;
        } else {
          const res = await api.get("/api/user/dashboard", { params });
          dashboardData = res.data;
        }

        if (dashboardData) {
          if (dashboardData.trainer) setTrainer(dashboardData.trainer);
          setStats((prev) => ({
            calories: dashboardData.caloriesConsumed || 0,
            water: dashboardData.water / 1000,
            workouts: dashboardData.completedWorkouts || 0,
            sleep: dashboardData.todaySleep ?? dashboardData.avgSleep ?? 0,
            streak: dashboardData.streak || 0,
            dailyStats: dashboardData.dailyStats || [],
            carbs: dashboardData.carbs ?? prev.carbs,
            protein: dashboardData.protein ?? prev.protein,
            fats: dashboardData.fats ?? prev.fats
          }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [viewMode, activeUser?.id]);
  // ⭐ DOWNLOAD PDF REPORT
  const handleDownloadReport = async () => {
    try {
      const response = await api.get("/api/reports/weekly", {
        params: { username: activeUser.username },
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `Health_Report_${activeUser.username}.pdf`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download report");
    }
  };

  const handleLogSleep = async () => {

    const today = new Date().toISOString().split("T")[0];

    if (selectedDate === today && isSleepLogged) {
      return alert("Sleep already logged for today!");
    }

    try {
      await api.post("/api/user/sleep-mood", {
        ...sleepData,
        sleepHours: Number(sleepData.sleepHours),
        date: selectedDate
      });

      setStats((prev) => ({
        ...prev,
        sleep: Number(sleepData.sleepHours)
      }));

      if (selectedDate === today) {
        setIsSleepLogged(true);
      }

      setSleepModal(false);

    } catch {
      alert("Failed to log sleep");
    }
  };
  const ProgressBar = ({ current, goal, colors }) => {
    const percentage = goal ? Math.min((current / goal) * 100, 100) : 0;
    return (
      <div style={{ marginTop: "15px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b" }}>{Math.round(percentage)}%</span>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Goal: {goal}</span>
        </div>
        <div style={{ background: "#f1f5f9", height: "10px", borderRadius: "10px", overflow: "hidden" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{ height: "100%", background: colors || "linear-gradient(90deg,#14b8a6,#6366f1)" }}
          />
        </div>
      </div>
    );
  };

  if (loading) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: "#14b8a6" }}>Loading Fitness Data...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: 1300, margin: "0 auto", minHeight: "100vh", backgroundColor: "#f8fafc" }}>

      {/* HEADER */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-1px", color: "#0f172a" }}>
            Welcome back, <span style={{ color: "#14b8a6", position: "relative" }}>{activeUser.username}</span>
          </h1>
          <p style={{ color: "#64748b", fontSize: "1.1rem", marginTop: "5px" }}>✨ Your health progress at a glance.</p>
        </motion.div>

        {!viewedUser && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: "8px", background: "#fee2e2", color: "#ef4444", padding: "10px 20px", borderRadius: "12px", fontWeight: "bold", border: "none", cursor: "pointer" }}
          >
            <LogOut size={18} /> Logout
          </motion.button>
        )}
      </header>

      {/* VIEW MODE SELECTOR */}
      <div style={{ marginBottom: "2.5rem", display: "flex", gap: 12, background: "#f1f5f9", padding: "6px", borderRadius: "14px", width: "fit-content" }}>
        {["daily", "weekly", "monthly"].map((mode) => (
          <motion.button
            key={mode}
            whileHover={{ scale: 1.02 }}
            onClick={() => setViewMode(mode)}
            style={{
              padding: "10px 24px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontWeight: "700",
              textTransform: "capitalize",
              background: viewMode === mode ? "white" : "transparent",
              color: viewMode === mode ? "#14b8a6" : "#64748b",
              boxShadow: viewMode === mode ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s"
            }}
          >
            {mode}
          </motion.button>
        ))}
      </div>

      {/* STATS CARDS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: "Calories", value: stats.calories, goal: goals.calories, icon: <Flame color="#f97316" />, color: "linear-gradient(90deg, #f97316, #fbbf24)" },
          { label: "Water (L)", value: stats.water, goal: goals.water, icon: <Droplets color="#0ea5e9" />, color: "linear-gradient(90deg, #0ea5e9, #38bdf8)" },
          { label: "Workouts", value: stats.workouts, goal: goals.workouts, icon: <Activity color="#10b981" />, color: "linear-gradient(90deg, #10b981, #34d399)" },
          { label: "Sleep (hrs)", value: stats.sleep, goal: goals.sleep, icon: <Moon color="#6366f1" />, color: "linear-gradient(90deg, #6366f1, #a855f7)", action: () => setSleepModal(true) }
        ].map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
            style={{ padding: "1.8rem", borderRadius: 24, background: "white", boxShadow: "0 10px 20px rgba(0,0,0,0.03)", position: "relative", border: "1px solid #f1f5f9" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ background: "#f8fafc", padding: "10px", borderRadius: "12px" }}>{item.icon}</div>
              {item.action && (
                <motion.button whileHover={{ rotate: 90 }} onClick={item.action} style={{ background: "none", border: "none", cursor: "pointer", color: "#6366f1" }}>
                  <PlusCircle size={24} />
                </motion.button>
              )}
            </div>
            <h3 style={{ color: "#64748b", fontSize: "14px", fontWeight: "600", marginTop: "15px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.label}</h3>
            <h2 style={{ fontSize: "2.4rem", fontWeight: 800, color: "#0f172a", margin: "5px 0" }}>{item.value}</h2>
            <ProgressBar current={item.value} goal={item.goal} colors={item.color} />
          </motion.div>
        ))}
      </div>

      {/* PREMIUM CHART AREA */}
      <div
        style={{
          padding: "2.5rem",
          borderRadius: 32,
          background: "linear-gradient(145deg, #0f172a, #1e293b)",
          color: "white",
          boxShadow: "0 30px 60px rgba(15, 23, 42, 0.3)",
          overflow: "hidden",
          position: "relative"
        }}
      >
        {/* Glow Decoration */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(20, 184, 166, 0.1)",
            borderRadius: "50%",
            filter: "blur(60px)"
          }}
        />

        {/* CHART GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "320px",
            gap: "2.5rem",
            marginBottom: "3rem",
            alignItems: "stretch"
          }}
        >
          <motion.div whileHover={{ scale: 1.01 }} style={{ height: "100%" }}>
            <DailyStatsChart data={stats.dailyStats} />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} style={{ height: "100%" }}>
            <TrainerAnalyticsChart data={stats.dailyStats} />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} style={{ height: "100%" }}>
            <NutritionMacroChart data={stats} />
          </motion.div>


          <motion.div whileHover={{ scale: 1.01 }}>
            <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <StreakRing streak={stats.streak} />
            </div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} style={{ height: "100%" }}>
            <HealthGaugeChart sleep={stats.sleep} water={stats.water} />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }}>
            <div style={{ height: "100%", display: "flex", alignItems: "center" }}>
              <ActivityAreaChart data={stats.dailyStats} />
            </div>
          </motion.div>

        </div>

        {/* TIP CARD */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            background: "rgba(255,255,255,0.05)",
            padding: "1.5rem",
            borderRadius: "20px",
            borderLeft: "4px solid #14b8a6"
          }}
        >
          <p
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: 0.6,
              fontSize: "13px",
              fontWeight: "bold",
              textTransform: "uppercase"
            }}
          >
            <Sparkles size={14} color="#14b8a6" /> Tip of the Day
          </p>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "500", marginTop: "5px" }}>
            "{randomTip}"
          </h3>
        </motion.div>
      </div>

      {/* TRAINER FOOTER + DOWNLOAD BUTTON */}
      {trainer && (
        <div style={{ marginTop: "3rem" }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              padding: "20px",
              background: "white",
              borderRadius: "20px",
              width: "fit-content",
              boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "50%" }}>
              <Award color="#22c55e" size={28} />
            </div>

            <div>
              <p style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "bold", textTransform: "uppercase" }}>
                Assigned Coach
              </p>

              <h3 style={{ fontSize: "1.1rem", color: "#0f172a" }}>
                Coach {trainer.username}
              </h3>

              <span style={{ fontSize: "13px", color: "#14b8a6", fontWeight: "600" }}>
                {trainer.specialization}
              </span>
            </div>
          </motion.div>

          {/* ⭐ DOWNLOAD REPORT BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownloadReport}
            style={{
              marginTop: "14px",
              padding: "12px 22px",
              borderRadius: "12px",
              border: "none",
              background: "#14b8a6",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 6px 14px rgba(20,184,166,0.3)"
            }}
          >
            Download Health Report (PDF)
          </motion.button>
        </div>
      )}

      {/* ⭐ SLEEP MODAL — MUST BE LAST */}
      <AnimatePresence>
        {sleepModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.8)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              padding: "20px"
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              style={{
                background: "white",
                padding: "2.5rem",
                borderRadius: 28,
                width: "100%",
                maxWidth: "400px",
                boxShadow: "0 25px 50px rgba(0,0,0,0.2)"
              }}
            >
              <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "1rem" }}>
                Log Sleep
              </h3>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  border: "2px solid #f1f5f9",
                  marginBottom: "1rem"
                }}
              />

              <input
                type="number"
                placeholder="0.0"
                value={sleepData.sleepHours}
                onChange={(e) =>
                  setSleepData({ ...sleepData, sleepHours: e.target.value })
                }
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: "12px",
                  border: "2px solid #f1f5f9",
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  marginBottom: "1.5rem",
                  outline: "none"
                }}
              />

              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  onClick={() => setSleepModal(false)}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#f1f5f9",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>

                <button
                  onClick={handleLogSleep}
                  style={{
                    flex: 2,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#14b8a6",
                    color: "white",
                    fontWeight: "bold",
                    cursor: "pointer"
                  }}
                >
                  Save Progress
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;