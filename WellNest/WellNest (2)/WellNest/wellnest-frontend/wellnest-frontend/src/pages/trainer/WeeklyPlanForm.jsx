import React, { useState } from "react";
import { assignWeeklyPlan } from "../../api/trainerApi";
import { useAuth } from "../../context/AuthContext";
import { Plus, Trash2, Calendar, Dumbbell, Utensils, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function WeeklyPlanForm({ userId }) {
  const { token } = useAuth();

  const [weekStartDate, setWeekStartDate] = useState("");
  const [workouts, setWorkouts] = useState([
    { workoutName: "", sets: "", reps: "", duration: "", workoutDate: "" },
  ]);
  const [meals, setMeals] = useState([
    { caloriesTarget: "", proteinTarget: "", carbsTarget: "", fatsTarget: "", nutritionDate: "" },
  ]);

  const addWorkout = () => {
    setWorkouts([...workouts, { workoutName: "", sets: "", reps: "", duration: "", workoutDate: "" }]);
  };

  const removeWorkout = (index) => {
    setWorkouts(workouts.filter((_, i) => i !== index));
  };

  const addMeal = () => {
    setMeals([...meals, { caloriesTarget: "", proteinTarget: "", carbsTarget: "", fatsTarget: "", nutritionDate: "" }]);
  };

  const removeMeal = (index) => {
    setMeals(meals.filter((_, i) => i !== index));
  };

  const handleWorkoutChange = (index, field, value) => {
    const updated = [...workouts];
    updated[index][field] = value;
    setWorkouts(updated);
  };

  const handleMealChange = (index, field, value) => {
    const updated = [...meals];
    updated[index][field] = value;
    setMeals(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        weekStartDate,
        workouts: workouts
          .filter(w => w.workoutName && w.workoutName.trim() !== "")
          .map(w => ({
            ...w,
            workoutDate: w.workoutDate || weekStartDate,
            sets: Number(w.sets) || 0,
            reps: Number(w.reps) || 0
          })),
        meals: meals
          .filter(m => m.caloriesTarget && String(m.caloriesTarget).trim() !== "")
          .map(m => ({
            ...m,
            nutritionDate: m.nutritionDate || weekStartDate,
            caloriesTarget: Number(m.caloriesTarget) || 0,
            proteinTarget: Number(m.proteinTarget) || 0,
            carbsTarget: Number(m.carbsTarget) || 0,
            fatsTarget: Number(m.fatsTarget) || 0
          }))
      };
      await assignWeeklyPlan(userId, payload);
      alert("Weekly Plan & Nutrition Targets Assigned Successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to assign plan. Please check inputs.");
    }
  };

  return (
    <div className="card p-8 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="flex items-center gap-4 mb-10 pb-6 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
          <Calendar size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Assignment Console</h2>
          <p className="text-slate-500 font-bold tracking-widest uppercase text-[10px]">Build Weekly Roadmap</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="flex flex-col gap-3 max-w-sm">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Week Start Date</label>
          <div className="relative">
            <input
              type="date"
              className="input-field pl-12"
              required
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
            />
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          </div>
        </div>

        {/* WORKOUTS SECTION */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Dumbbell className="text-indigo-500" size={20} /> Workout Regimen
            </h3>
            <button type="button" onClick={addWorkout} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '12px' }}>
              <Plus size={16} /> Add Workout
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {workouts.map((w, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-slate-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-4 relative group"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Workout Name</label>
                    <input
                      placeholder="e.g. Bench Press"
                      className="input-field bg-white"
                      value={w.workoutName}
                      onChange={(e) => handleWorkoutChange(index, "workoutName", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Sets</label>
                    <input
                      placeholder="3"
                      type="number"
                      className="input-field bg-white"
                      value={w.sets}
                      onChange={(e) => handleWorkoutChange(index, "sets", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Reps</label>
                    <input
                      placeholder="12"
                      type="number"
                      className="input-field bg-white"
                      value={w.reps}
                      onChange={(e) => handleWorkoutChange(index, "reps", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Dur. (Min)</label>
                    <input
                      placeholder="45 min"
                      className="input-field bg-white"
                      value={w.duration}
                      onChange={(e) => handleWorkoutChange(index, "duration", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Target Date</label>
                    <input
                      type="date"
                      className="input-field bg-white"
                      value={w.workoutDate}
                      onChange={(e) => handleWorkoutChange(index, "workoutDate", e.target.value)}
                      required
                    />
                  </div>
                  {workouts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeWorkout(index)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-rose-500 shadow-lg border border-rose-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* MEALS SECTION */}
        <section className="space-y-6">
          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <Utensils className="text-rose-500" size={20} /> Nutrition Targets
            </h3>
            <button type="button" onClick={addMeal} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', borderRadius: '12px', background: 'var(--secondary-gradient)' }}>
              <Plus size={16} /> Add Meal
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {meals.map((m, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-[#fff8f8] p-6 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-4 relative group border border-rose-50"
                >
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-rose-400 uppercase">Kcal</label>
                    <input
                      type="number"
                      placeholder="700"
                      className="input-field bg-white"
                      value={m.caloriesTarget}
                      onChange={(e) => handleMealChange(index, "caloriesTarget", e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-orange-400 uppercase">Prot (g)</label>
                    <input
                      type="number"
                      placeholder="40"
                      className="input-field bg-white"
                      value={m.proteinTarget}
                      onChange={(e) => handleMealChange(index, "proteinTarget", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-green-400 uppercase">Carb (g)</label>
                    <input
                      type="number"
                      placeholder="80"
                      className="input-field bg-white"
                      value={m.carbsTarget}
                      onChange={(e) => handleMealChange(index, "carbsTarget", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-purple-400 uppercase">Fat (g)</label>
                    <input
                      type="number"
                      placeholder="20"
                      className="input-field bg-white"
                      value={m.fatsTarget}
                      onChange={(e) => handleMealChange(index, "fatsTarget", e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1 col-span-2 md:col-span-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase">Target Date</label>
                    <input
                      type="date"
                      className="input-field bg-white"
                      value={m.nutritionDate}
                      onChange={(e) => handleMealChange(index, "nutritionDate", e.target.value)}
                      required
                    />
                  </div>
                  {meals.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMeal(index)}
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white text-rose-500 shadow-lg border border-rose-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <button type="submit" className="btn-primary w-full py-5 rounded-2xl text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200">
          <Save size={24} /> Deploy Weekly Roadmap
        </button>
      </form>
    </div>
  );
}
