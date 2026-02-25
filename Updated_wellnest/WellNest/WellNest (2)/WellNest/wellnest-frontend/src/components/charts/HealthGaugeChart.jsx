import React from "react";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis
} from "recharts";

const HealthGaugeChart = ({ sleep = 0, water = 0 }) => {

  // ⭐ Convert water safely (ml → L if needed)
const waterLiters = water; // already liters from dashboard
  // ⭐ Percent calculations (clamped)
  const sleepPercent = Math.min((sleep / 8) * 100, 100);
  const waterPercent = Math.min((waterLiters / 3) * 100, 100);

  const data = [
    {
      name: "Sleep",
      value: sleepPercent,
      fill: "#6366f1"
    },
    {
      name: "Water",
      value: waterPercent,
      fill: "#14b8a6"
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
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* ⭐ TITLE (same style as others) */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "8px",
          color: "#0f172a"
        }}
      >
        Health Recovery Gauge
      </h3>

      {/* ⭐ CHART AREA */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            startAngle={180}
            endAngle={0}
          >
            <PolarAngleAxis
              type="number"
              domain={[0, 100]}
              tick={false}
            />

            {/* ⭐ OUTER WATER RING */}
            <RadialBar
              dataKey="value"
              data={[data[1]]}
              innerRadius="65%"
              outerRadius="95%"
              cornerRadius={14}
              background
            />

            {/* ⭐ INNER SLEEP RING */}
            <RadialBar
              dataKey="value"
              data={[data[0]]}
              innerRadius="40%"
              outerRadius="60%"
              cornerRadius={14}
              background
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>

      {/* ⭐ CENTER LABEL */}
      <div style={{ textAlign: "center", marginTop: "4px" }}>
        <p
          style={{
            fontWeight: 700,
            color: "#0f172a",
            fontSize: "14px"
          }}
        >
          Sleep: {sleep}h | Water: {waterLiters.toFixed(1)}L
        </p>
      </div>
    </div>
  );
};

export default HealthGaugeChart;