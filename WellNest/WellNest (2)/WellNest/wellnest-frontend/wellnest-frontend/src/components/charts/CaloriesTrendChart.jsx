// src/components/charts/CaloriesTrendChart.jsx

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const CaloriesTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // ⭐ Format safely
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    calories: d.caloriesConsumed ?? 0
  }));

  return (
    <div
      className="card"
      style={{
        width: "100%",
        height: 260,
        background: "#fff",
        borderRadius: "16px",
        padding: "1rem"
      }}
    >
      {/* ⭐ TITLE — same style as your other charts */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "10px",
          color: "#0f172a"
        }}
      >
        Calories Trend
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          {/* ⭐ Stable scaling */}
          <YAxis domain={[0, "dataMax + 200"]} />

          {/* ⭐ Cleaner tooltip */}
          <Tooltip formatter={(value) => [`${value} kcal`, "Calories"]} />

          <Bar
            dataKey="calories"
            fill="#6366f1"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesTrendChart;