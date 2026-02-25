// src/components/charts/SleepTrendChart.jsx

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

const SleepTrendChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // ⭐ Safe formatting
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    sleep: Number(d.sleepHours) || 0
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
      {/* ⭐ TITLE — consistent style */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "8px",
          color: "#0f172a"
        }}
      >
        Sleep Trend
      </h3>

      {/* ⭐ CHART AREA fills card properly */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatted}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

            <XAxis
              dataKey="date"
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
            />

            {/* ⭐ AUTO SCALE (fix monthly tiny issue) */}
            <YAxis
              domain={[0, "dataMax + 2"]}
              stroke="#334155"
              tick={{ fill: "#334155", fontSize: 12 }}
            />

            <Tooltip
              formatter={(value) => `${value} hrs`}
              contentStyle={{
                background: "#0f172a",
                border: "none",
                borderRadius: "10px",
                color: "white"
              }}
              labelStyle={{ color: "#94a3b8" }}
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="sleep"
              name="Sleep Hours"
              stroke="#14b8a6"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SleepTrendChart;