// src/components/charts/NutritionProgressChart.jsx

import React from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#6366f1", "#14b8a6", "#f97316"];

const NutritionProgressChart = ({ stats }) => {
  if (!stats) return null;

  // ⭐ SAFE VALUES (no falsy issues)
  const protein = Number(stats.proteinConsumed) || 0;
  const carbs = Number(stats.carbsConsumed) || 0;
  const fats = Number(stats.fatsConsumed) || 0;

  const total = protein + carbs + fats;

  // ⭐ Only use fallback when EVERYTHING is zero
  const data =
    total === 0
      ? [
          { name: "Protein", value: 1 },
          { name: "Carbs", value: 1 },
          { name: "Fats", value: 1 }
        ]
      : [
          { name: "Protein", value: protein },
          { name: "Carbs", value: carbs },
          { name: "Fats", value: fats }
        ];

  return (
    <div
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
      {/* ⭐ Title */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "10px",
          color: "#0f172a"
        }}
      >
        Nutrition Progress
      </h3>

      {/* ⭐ Chart area fills card properly */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              innerRadius={55}
              paddingAngle={3}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>

            <Tooltip formatter={(value, name) => [`${value} g`, name]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default NutritionProgressChart;