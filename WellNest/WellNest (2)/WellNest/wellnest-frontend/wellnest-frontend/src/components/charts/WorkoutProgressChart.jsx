// src/components/charts/WorkoutProgressChart.jsx

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const WorkoutProgressChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    workouts: d.workoutsCompleted || 0
  }));

  return (
    <div
      style={{
        width: "100%",
        height: 260,
        background: "#fff",
        borderRadius: "16px",
        padding: "1rem"
      }}
    >
      {/* ⭐ TITLE */}
      <h3 style={{ fontWeight: 800, marginBottom: "10px", color: "#0f172a" }}>
        Workout Progress
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          {/* ⭐ Dynamic Y axis instead of fixed 5 */}
          <YAxis allowDecimals={false} />

          {/* ⭐ TOOLTIP */}
          <Tooltip formatter={(value) => [`${value}`, "Workouts"]} />

          {/* ⭐ LEGEND NAME ADDED */}
          <Legend />

          <Line
            type="linear"
            dataKey="workouts"
            name="Workouts Completed"   // ⭐ THIS ADDS NAME LIKE OTHER CHARTS
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WorkoutProgressChart;