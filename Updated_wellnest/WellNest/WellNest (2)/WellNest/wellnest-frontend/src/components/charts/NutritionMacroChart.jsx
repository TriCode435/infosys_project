import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

const COLORS = ["#6366f1", "#14b8a6", "#f97316"];

const NutritionMacroChart = ({ data }) => {
  if (!data) return null;

  // ⭐ FIXED: use stats fields from dashboard
  const protein = Number(data.protein || 0);
  const carbs = Number(data.carbs || 0);
  const fats = Number(data.fats || 0);

  const total = protein + carbs + fats;

  // ⭐ If no nutrition logged → show empty ring instead of fake 1g
  const chartData =
    total === 0
      ? []
      : [
          { name: "Protein", value: protein },
          { name: "Carbs", value: carbs },
          { name: "Fats", value: fats }
        ];

  return (
    <div
      className="card"
      style={{
        padding: "1.5rem",
        marginBottom: "2rem",
        background: "#fff",
        borderRadius: "16px"
      }}
    >
      <h3
        style={{
          fontWeight: 900,
          color: "#0f172a",
          marginBottom: "1rem"
        }}
      >
        Nutrition Macro Breakdown
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            innerRadius={55}
            paddingAngle={3}
            isAnimationActive
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip formatter={(value, name) => [`${value} g`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NutritionMacroChart;