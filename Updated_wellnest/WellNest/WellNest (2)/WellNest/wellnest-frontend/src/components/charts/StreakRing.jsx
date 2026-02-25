import React from "react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer
} from "recharts";

const StreakRing = ({ streak = 0 }) => {

  // ⭐ Prevent negative or undefined
  const safeStreak = Math.max(streak || 0, 0);

  // ⭐ Fixed goal so ring shows real progress
  const GOAL_STREAK = 7; // weekly streak target

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
      {/* ⭐ TITLE ADDED */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "8px",
          color: "#0f172a"
        }}
      >
        Streak Progress
      </h3>

      {/* ⭐ CHART AREA */}
      <div style={{ flex: 1, position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            innerRadius="60%"
            outerRadius="90%"
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, GOAL_STREAK]}
              tick={false}
            />

            <RadialBar
              dataKey="value"
              cornerRadius={14}
              background
            />
          </RadialBarChart>
        </ResponsiveContainer>

        {/* ⭐ CENTER TEXT */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            pointerEvents: "none"
          }}
        >
          <h2
            style={{
              fontWeight: 800,
              color: "#0f172a",
              fontSize: "26px"
            }}
          >
            {safeStreak}
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "#64748b",
              fontWeight: 600
            }}
          >
            Day Streak
          </p>
        </div>
      </div>
    </div>
  );
};

export default StreakRing;