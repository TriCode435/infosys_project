import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

const ActivityAreaChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  // ⭐ Format safely
  const formatted = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short"
    }),
    steps: d.stepsCount ?? d.steps ?? 0
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
      {/* ⭐ TITLE — same style as other charts */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "10px",
          color: "#0f172a"
        }}
      >
        Step Count Trend
      </h3>

      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="date" />

          {/* ⭐ Stable dynamic scaling */}
          <YAxis domain={[0, "dataMax + 500"]} />

          {/* ⭐ Cleaner tooltip */}
          <Tooltip formatter={(value) => [`${value} steps`, "Steps"]} />

          <Area
            type="monotone"
            dataKey="steps"
            stroke="#22c55e"
            fill="#22c55e"
            fillOpacity={0.2}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityAreaChart;