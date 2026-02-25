import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from "recharts";

const TrainerAnalyticsChart = ({ data = [] }) => {

  if (!data || data.length === 0) return null;

  // ⭐ Format data safely
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    calories: d.caloriesConsumed || 0,
    workouts: d.workoutsCompleted || 0
  }));

  return (
    <div
      className="card"
      style={{
        width: "100%",
        height: 260,
        background: "#fff",
        borderRadius: "16px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* ⭐ TITLE — SAME STYLE AS OTHER CHARTS */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "8px",
          color: "#0f172a"
        }}
      >
        Performance Analytics
      </h3>

      {/* ⭐ CHART AREA — FILLS CARD PROPERLY */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey="date"
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
            />

            {/* ⭐ CALORIES SCALE */}
            <YAxis
              yAxisId="left"
              domain={[0, "dataMax + 200"]}
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
            />

            {/* ⭐ WORKOUTS SCALE */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, "dataMax + 1"]}
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
            />

            <Tooltip />
            <Legend />

            {/* Calories Bars */}
            <Bar
              yAxisId="left"
              dataKey="calories"
              name="Calories"
              fill="#6366f1"
              radius={[8, 8, 0, 0]}
            />

            {/* Workouts Bars */}
            <Bar
              yAxisId="right"
              dataKey="workouts"
              name="Workouts"
              fill="#22c55e"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrainerAnalyticsChart;