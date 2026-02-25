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

const GoalComparisonChart = ({ stats = {}, goals = {} }) => {

  // ⭐ Safe values
  const calories = stats.calories || 0;
  const workouts = stats.workouts || 0;
  const sleep = stats.sleep || 0;
  const waterRaw = stats.water || 0;

  // ⭐ Water already liters sometimes → protect conversion
  const waterValue = waterRaw > 20 ? waterRaw / 1000 : waterRaw;

  // ⭐ Convert to percentage safely
  const percent = (value, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((value / goal) * 100, 200);
  };

  const data = [
    {
      name: "Calories",
      achieved: percent(calories, goals.calories),
      goal: 100
    },
    {
      name: "Water",
      achieved: percent(waterValue, goals.water),
      goal: 100
    },
    {
      name: "Workouts",
      achieved: percent(workouts, goals.workouts),
      goal: 100
    },
    {
      name: "Sleep",
      achieved: percent(sleep, goals.sleep),
      goal: 100
    }
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
      {/* ⭐ TITLE — same styling as other charts */}
      <h3
        style={{
          fontWeight: 800,
          marginBottom: "10px",
          color: "#0f172a"
        }}
      >
        Goal vs Achievement (%)
      </h3>

      {/* ⭐ Chart area fills remaining space */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            {/* ⭐ dynamic scaling */}
            <YAxis domain={[0, "dataMax + 20"]} />

            <Tooltip formatter={(value) => `${Math.round(value)}%`} />

            <Legend />

            {/* Goal */}
            <Bar
              dataKey="goal"
              name="Goal"
              fill="#ec4899"
              radius={[8, 8, 0, 0]}
            />

            {/* Achieved */}
            <Bar
              dataKey="achieved"
              name="Achieved"
              fill="#16a34a"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GoalComparisonChart;