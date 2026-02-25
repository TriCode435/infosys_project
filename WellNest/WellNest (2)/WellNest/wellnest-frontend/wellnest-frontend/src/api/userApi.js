import api from "./axios";

export const getLatestWeeklyPlan = () =>
  api.get("/api/user/weekly-plan");

export const completeWorkout = (workoutId) =>
  api.put(`/api/user/workout/${workoutId}/complete`);

export const getNutritionLog = (params, userId = null) => {
  const query = params.date ? `date=${params.date}` : `startDate=${params.startDate}&endDate=${params.endDate}`;
  return userId ? api.get(`/api/trainer/users/${userId}/meals?${query}`) : api.get(`/api/user/nutrition-logs?${query}`);
};

export const getNutritionDetails = (date, userId = null) =>
  userId ? api.get(`/api/trainer/users/${userId}/meals?date=${date}`) : api.get(`/api/user/nutrition?date=${date}`);

export const logNutrition = (data) =>
  api.post("/api/user/nutrition-log", data);

export const deleteNutritionLog = (id) =>
  api.delete(`/api/user/nutrition-logs/${id}`);

export const getDashboardSummary = (params = {}, userId = null) => {
  const query = params.startDate && params.endDate
    ? `startDate=${params.startDate}&endDate=${params.endDate}`
    : (params.date ? `startDate=${params.date}&endDate=${params.date}` : "");
  return userId
    ? api.get(`/api/trainer/users/${userId}/dashboard-stats?${query}`)
    : api.get(`/api/user/dashboard-summary?${query}`);
};

export const getRandomTip = () =>
  api.get("/api/user/tip-of-the-day");

export const getUserWorkouts = (params, userId = null) => {
  const query = params.date ? `date=${params.date}` : `startDate=${params.startDate}&endDate=${params.endDate}`;
  return userId ? api.get(`/api/trainer/users/${userId}/workouts?${query}`) : api.get(`/api/user/workouts?${query}`);
};

export const deleteWorkout = (id) => api.delete(`/api/user/workouts/${id}`);

export const getSleepMoodLogs = (params, userId = null) => {
  const query = params.date ? `date=${params.date}` : `startDate=${params.startDate}&endDate=${params.endDate}`;
  return userId ? api.get(`/api/trainer/users/${userId}/sleep-mood?${query}`) : api.get(`/api/user/sleep-mood?${query}`);
};
export const logSleepMood = (data) =>
  api.post("/api/user/sleep-mood", data);

export const deleteSleepMood = (id) =>
  api.delete(`/api/user/sleep-mood/${id}`);
export const logWorkout = (data) =>
  api.post("/api/user/workouts", data);

export const getTrainerSuggestions = (goal) =>
  api.get("/api/user/trainer-suggestions", { params: { goal } });

export const assignTrainer = (trainerId) =>
  api.post(`/api/user/assign-trainer/${trainerId}`);

export const getBlogPosts = () =>
  api.get("/api/blog");

export const createBlogPost = (data) =>
  api.post("/api/blog", data);

export const getProfile = () =>
  api.get("/api/user/profile");

export const updateProfile = (data) =>
  api.put("/api/user/profile", data);
