import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";

const StreakProgressChart = ({ streak = 0 }) => {

  // ⭐ Safe streak value
  const safeStreak = Math.max(streak || 0, 0);

  // ⭐ Fixed visual goal so arc doesn't look tiny
  const GOAL_STREAK = 7;

  const data = [
    {
      name: "Streak",
      value: Math.min(safeStreak, GOAL_STREAK),
      fill: "#22c55e"
    }
  ];

  return (
    <div
      className="card"
      style={{
        width: "100%",
        height: 260,
        background: "#fff",
        borderRadius: "16px",
        padding: "1rem",
        position: "relative",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* ⭐ TITLE (same style as other charts) */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "8px",
          color: "#0f172a"
        }}
      >
        Streak Progress
      </h3>

      {/* ⭐ CHART AREA — fills card properly */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="65%"
            outerRadius="95%"
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, GOAL_STREAK]}
              tick={false}
            />

            <RadialBar
              dataKey="value"
              cornerRadius={12}
              background
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* ⭐ CENTER LABEL */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none"
        }}
      >
        <p style={{ fontSize: "24px", fontWeight: 900, color: "#0f172a" }}>
          {safeStreak}
        </p>
        <p style={{ fontSize: "12px", color: "#64748b", fontWeight: 600 }}>
          Day Streak
        </p>
      </div>
    </div>
  );
};

export default StreakProgressChart;