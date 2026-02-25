import api from "./axios";

export const assignWeeklyPlan = (userId, data) =>
  api.post(`/api/trainer/users/${userId}/assign-weekly-plan`, data);

export const getUserWeeklyPlan = (userId) =>
  api.get(`/api/trainer/users/${userId}/weekly-plan`);

export const searchTrainers = (params) =>
  api.get("/api/trainers/search", { params });

export const getTrainerProfileById = (id) =>
  api.get(`/api/trainers/${id}`);
export const assignTrainer = (trainerId) =>
  api.post(`/api/user/assign-trainer/${trainerId}`);
