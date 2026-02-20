import api from "./axios";

export const assignWeeklyPlan = (userId, data) =>
  api.post(`/api/trainer/users/${userId}/assign-weekly-plan`, data);

export const getUserWeeklyPlan = (userId) =>
  api.get(`/api/trainer/users/${userId}/weekly-plan`);
