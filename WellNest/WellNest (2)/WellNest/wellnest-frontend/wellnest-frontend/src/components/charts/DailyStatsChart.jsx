import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

const DailyStatsChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // ⭐ Format date safely
  const formatDate = (date) => {
    try {
      return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short"
      });
    } catch {
      return date;
    }
  };

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
      {/* ⭐ CLEAN TITLE */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "10px",
          color: "#0f172a"
        }}
      >
        Weekly Progress Overview
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data}>
          {/* GRID */}
          <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />

          {/* ⭐ FIXED X AXIS (Monthly compression fix) */}
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval="preserveStartEnd"
            minTickGap={30}
            stroke="#334155"
            tick={{ fill: "#334155", fontSize: 12 }}
          />

          {/* ⭐ LEFT AXIS → CALORIES */}
          <YAxis
            yAxisId="left"
            stroke="#334155"
            domain={[0, "auto"]}
            tick={{ fill: "#334155", fontSize: 12 }}
          />

          {/* ⭐ RIGHT AXIS → SLEEP + WORKOUTS */}
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#334155"
            domain={[0, "auto"]}
            tick={{ fill: "#334155", fontSize: 12 }}
          />

          {/* TOOLTIP */}
          <Tooltip
            contentStyle={{
              background: "#0f172a",
              border: "none",
              borderRadius: "10px",
              color: "white"
            }}
            labelStyle={{ color: "#94a3b8" }}
          />

          {/* LEGEND */}
          <Legend />

          {/* ⭐ Calories Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="caloriesConsumed"
            name="Calories"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />

          {/* ⭐ Sleep Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="sleepHours"
            name="Sleep"
            stroke="#14b8a6"
            strokeWidth={3}
            dot={{ r: 4 }}
          />

          {/* ⭐ Workouts Line */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="workoutsCompleted"
            name="Workouts"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyStatsChart;