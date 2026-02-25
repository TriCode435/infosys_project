import React, { useEffect, useState } from "react";
import {
  getLatestWeeklyPlan,
  completeWorkout,
} from "../../api/userApi";
import WeeklyProgressBar from "../../components/WeeklyProgressBar";

export default function UserWeeklyPlan() {
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const res = await getLatestWeeklyPlan();
      setPlan(res.data);
    } catch (error) {
      console.error("Failed to load plan", error);
    }
  };

  const markComplete = async (id) => {
    if (plan?.locked) {
      alert("This week is locked. You cannot complete workouts for a locked week.");
      return;
    }

    try {
      await completeWorkout(id);
      loadPlan(); // Refresh after update
    } catch (error) {
      console.error("Failed to complete workout", error);
      alert(error.response?.data?.message || "Failed to complete workout.");
    }
  };

  if (!plan) return <p className="text-center text-gray-500 py-8">No active weekly plan found.</p>;

  const total = plan.workouts.length;
  const completed = plan.workouts.filter((w) => w.completed).length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">This Week Plan</h2>

      <WeeklyProgressBar progress={progress} />

      <div className="flex flex-col gap-3 mt-4">
        {plan.workouts.map((w) => (
          <div
            key={w.id}
            className={`p-4 rounded-xl border flex justify-between items-center transition-all ${w.completed
              ? "bg-green-50 border-green-200"
              : "bg-white border-slate-100"
              }`}
          >
            <div>
              <strong className={`block ${w.completed ? "text-green-700" : "text-slate-700"}`}>
                {w.exerciseName || w.workoutName || "Exercise"}
              </strong>
              <p className="text-sm text-slate-500">
                {w.targetReps || 0} reps • {w.targetTime || 0} min {plan.locked && <span className="text-[10px] text-rose-400 font-bold ml-2">(LOCKED)</span>}
              </p>
            </div>

            {!w.completed ? (
              <button
                onClick={() => markComplete(w.id)}
                className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:brightness-110 transition-all"
              >
                Complete
              </button>
            ) : (
              <span className="text-green-600 font-bold text-sm bg-green-100 px-3 py-1 rounded-full">
                Done
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
