import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Save,
} from "lucide-react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";
import WeeklyPlanForm from "./WeeklyPlanForm";

const UserDetailDashboard = () => {
  const { id } = useParams();
  const [athlete, setAthlete] = useState(null);

  useEffect(() => {
    const fetchAthlete = async () => {
      try {
        const res = await api.get(`/api/trainer/users/${id}/profile`);
        setAthlete(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAthlete();
  }, [id]);


  return (
    <div
      className="container"
      style={{
        paddingTop: "2rem",
        paddingBottom: "6rem",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem"
      }}
    >
      {/* HEADER */}
      <header className="flex items-center gap-6">
        <Link
          to="/trainer/dashboard"
          className="card"
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ChevronLeft size={20} />
        </Link>

        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 800 }}>
            {athlete
              ? athlete.fullName || athlete.username
              : "Member Plan"}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <p style={{ fontSize: "13px", color: "#64748b" }}>
              Training & Nutrition Management
            </p>
            <Link
              to={`/trainer/athlete-performance/${id}`}
              className="btn-primary"
              style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}
            >
              View User Dashboard ↗
            </Link>
          </div>
        </div>
      </header>

{/* PROFILE SUMMARY CARD */}
{athlete && (
  <>
    {/* ⭐ BASIC PROFILE + TARGET INFO */}
    <div
      className="card"
      style={{
        padding: "1.8rem",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
        gap: "2rem"
      }}
    >
      {/* AGE */}
      <div>
        <p className="text-slate-400 text-xs uppercase">Age</p>
        <h3 className="font-bold">{athlete.age || "--"}</h3>
      </div>

      {/* GOAL */}
      <div>
        <p className="text-slate-400 text-xs uppercase">Goal</p>
        <h3 className="font-bold">
          {athlete.fitnessGoal || "General"}
        </h3>
      </div>

      {/* WEIGHT */}
      <div>
        <p className="text-slate-400 text-xs uppercase">Weight</p>
        <h3 className="font-bold">
          {athlete.weight ? `${athlete.weight} kg` : "--"}
        </h3>
      </div>

      {/* TARGET WEIGHT */}
      <div>
        <p className="text-slate-400 text-xs uppercase">Target Weight</p>
        <h3 className="font-bold">
          {athlete.targetWeight
            ? `${athlete.targetWeight} kg`
            : "--"}
        </h3>
      </div>

      {/* ⭐ TARGET TIME */}
<div>
  <p className="text-slate-400 text-xs uppercase">Target Time</p>
  <h3 className="font-bold">
    {athlete.targetTimeWeeks
      ? `${athlete.targetTimeWeeks} weeks`
      : "--"}
  </h3>
</div>
        
    </div>

    {/* ⭐ MEDICAL NOTES CARD */}
    <div
      className="card"
      style={{
        padding: "1.6rem",
        borderRadius: "16px",
        background: "#f8fafc"
      }}
    >
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "8px",
          fontSize: "15px"
        }}
      >
        Medical Notes
      </h3>

      <p style={{ color: "#475569", fontSize: "14px" }}>
        {athlete.medicalNotes || "No medical conditions provided"}
      </p>
    </div>
  </>
)}
      {/* CONSOLIDATED ASSIGNMENT FORM */}
      <div className="card-outer">
        <WeeklyPlanForm userId={id} />
      </div>
    </div>
  );
};

export default UserDetailDashboard;
