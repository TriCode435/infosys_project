package com.wellnest.service;

import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import com.wellnest.dto.*;
import com.wellnest.entity.*;
import com.wellnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class TrainerService {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private WeeklyPlanRepository weeklyPlanRepo;

        @Autowired
        private TrainerProfileRepository trainerProfileRepository;

        @Autowired
        private WorkoutPlanRepository workoutPlanRepository;

        @Autowired
        @org.springframework.context.annotation.Lazy
        private UserService userService;

        @Autowired
        private CalculationService calculationService;

        public List<UserProfileDTO> getAssignedUsers(String trainerUsername) {
                User trainer = userRepository.findByUsername(trainerUsername)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                List<User> users = userRepository.findByAssignedTrainer(trainer);

                return users.stream().map(u -> userService.getProfile(u.getUsername()))
                                .collect(Collectors.toList());
        }

        public TrainerProfileDTO getTrainerProfile(String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                TrainerProfile profile = trainerProfileRepository.findByUser(user)
                                .orElseGet(() -> {
                                        TrainerProfile newProfile = TrainerProfile.builder()
                                                        .user(Objects.requireNonNull(user)).build();
                                        return Objects.requireNonNull(trainerProfileRepository
                                                        .save(Objects.requireNonNull(newProfile)));
                                });

                TrainerProfileDTO dto = new TrainerProfileDTO();
                dto.setId(user.getId());
                dto.setSpecialization(profile.getSpecialization());
                dto.setAvailableHoursPerDay(profile.getAvailableHoursPerDay());
                dto.setExperienceYears(profile.getExperienceYears());
                return dto;
        }

        public void updateTrainerProfile(String username, TrainerProfileDTO dto) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                TrainerProfile profile = trainerProfileRepository.findByUser(user)
                                .orElseGet(() -> TrainerProfile.builder().user(Objects.requireNonNull(user)).build());

                profile.setSpecialization(dto.getSpecialization());
                profile.setAvailableHoursPerDay(dto.getAvailableHoursPerDay());
                profile.setExperienceYears(dto.getExperienceYears());
                trainerProfileRepository.save(Objects.requireNonNull(profile));
        }

        public UserProfileDTO getAthleteProfile(Long userId) {
                if (userId == null)
                        throw new IllegalArgumentException("User ID must not be null");
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return userService.getProfile(user.getUsername());
        }

        public void assignWeeklyPlan(String trainerUsername, Long userId, WeeklyPlanRequest request) {
                if (userId == null)
                        throw new IllegalArgumentException("User ID must not be null");
                User trainer = userRepository.findByUsername(trainerUsername)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));

                User athlete = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                WeeklyPlan weeklyPlan = weeklyPlanRepo
                                .findByUserAndWeekStartDate(athlete, request.getWeekStartDate())
                                .orElse(new WeeklyPlan());

                weeklyPlan.setTrainer(trainer);
                weeklyPlan.setUser(athlete);
                weeklyPlan.setWeekStartDate(request.getWeekStartDate());

                // Handle Workouts
                if (request.getWorkouts() != null) {
                        if (weeklyPlan.getWorkouts() != null) {
                                weeklyPlan.getWorkouts().clear();
                        } else {
                                weeklyPlan.setWorkouts(new java.util.ArrayList<>());
                        }

                        List<WorkoutPlan> workouts = request.getWorkouts().stream().map(w -> {
                                WorkoutPlan wp = new WorkoutPlan();
                                wp.setWorkoutName(w.getWorkoutName());
                                wp.setSets(w.getSets());
                                wp.setReps(w.getReps());
                                wp.setDuration(w.getDuration());
                                wp.setWorkoutDate(w.getWorkoutDate() != null ? w.getWorkoutDate()
                                                : request.getWeekStartDate());
                                wp.setWeeklyPlan(weeklyPlan);
                                wp.setUser(athlete);
                                return wp;
                        }).collect(Collectors.toList());

                        weeklyPlan.getWorkouts().addAll(workouts);
                }

                // Handle Nutrition Assignments
                if (request.getMeals() != null) {
                        if (weeklyPlan.getNutritionAssignments() != null) {
                                weeklyPlan.getNutritionAssignments().clear();
                        } else {
                                weeklyPlan.setNutritionAssignments(new java.util.ArrayList<>());
                        }

                        List<NutritionAssignment> nutritionAssignments = request.getMeals().stream().map(m -> {
                                NutritionAssignment na = new NutritionAssignment();
                                na.setCaloriesTarget(m.getCaloriesTarget());
                                na.setProteinTarget(m.getProteinTarget());
                                na.setCarbsTarget(m.getCarbsTarget());
                                na.setFatsTarget(m.getFatsTarget());
                                na.setNutritionDate(m.getNutritionDate() != null ? m.getNutritionDate()
                                                : request.getWeekStartDate());
                                na.setWeeklyPlan(weeklyPlan);
                                return na;
                        }).collect(Collectors.toList());

                        weeklyPlan.getNutritionAssignments().addAll(nutritionAssignments);
                }

                weeklyPlanRepo.save(Objects.requireNonNull(weeklyPlan));
        }

        public void cloneLastWeek(String trainerUsername,
                        Long userId,
                        LocalDate newWeekStart) {
                if (userId == null)
                        throw new IllegalArgumentException("User ID must not be null");
                User trainer = userRepository.findByUsername(trainerUsername)
                                .orElseThrow();

                User athlete = userRepository.findById(userId)
                                .orElseThrow();

                List<WeeklyPlan> plans = weeklyPlanRepo.findByUserOrderByWeekStartDateDesc(athlete);

                if (plans.isEmpty())
                        throw new RuntimeException("No previous plan to clone");

                WeeklyPlan lastPlan = plans.get(0);

                WeeklyPlan newPlan = new WeeklyPlan();
                newPlan.setUser(athlete);
                newPlan.setTrainer(trainer);
                newPlan.setWeekStartDate(newWeekStart);

                long dayShift = java.time.temporal.ChronoUnit.DAYS.between(lastPlan.getWeekStartDate(), newWeekStart);

                List<WorkoutPlan> clonedWorkouts = lastPlan.getWorkouts().stream().map(w -> {
                        WorkoutPlan wp = new WorkoutPlan();
                        wp.setWorkoutName(w.getWorkoutName());
                        wp.setReps(w.getReps());
                        wp.setDuration(w.getDuration());
                        wp.setSets(w.getSets());
                        wp.setWeeklyPlan(newPlan);
                        wp.setUser(athlete);
                        if (w.getWorkoutDate() != null) {
                                wp.setWorkoutDate(w.getWorkoutDate().plusDays(dayShift));
                        }
                        return wp;
                }).collect(Collectors.toList());

                List<NutritionAssignment> clonedNutrition = lastPlan.getNutritionAssignments().stream().map(m -> {
                        NutritionAssignment na = new NutritionAssignment();
                        na.setCaloriesTarget(m.getCaloriesTarget());
                        na.setProteinTarget(m.getProteinTarget());
                        na.setCarbsTarget(m.getCarbsTarget());
                        na.setFatsTarget(m.getFatsTarget());
                        na.setWeeklyPlan(newPlan);
                        if (m.getNutritionDate() != null) {
                                na.setNutritionDate(m.getNutritionDate().plusDays(dayShift));
                        }
                        return na;
                }).collect(Collectors.toList());

                newPlan.setWorkouts(clonedWorkouts);
                newPlan.setNutritionAssignments(clonedNutrition);

                weeklyPlanRepo.save(Objects.requireNonNull(newPlan));
        }

        public TrainerStatsDTO getTrainerStats(String trainerUsername) {
                User trainer = userRepository.findByUsername(trainerUsername)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));
                List<User> athletes = userRepository.findByAssignedTrainer(trainer);

                long totalAssignedWorkouts = workoutPlanRepository.countByWeeklyPlan_Trainer(trainer);
                long completedWorkouts = workoutPlanRepository.countByWeeklyPlan_TrainerAndCompleted(trainer, true);

                return TrainerStatsDTO.builder()
                                .activeClients(athletes.size())
                                .totalAssignments(totalAssignedWorkouts)
                                .completionRate(calculationService.calculatePercentage(completedWorkouts,
                                                totalAssignedWorkouts))
                                .build();
        }

        public DashboardSummaryDTO getAthleteDashboardStats(Long userId, LocalDate startDate, LocalDate endDate) {
                if (userId == null)
                        throw new IllegalArgumentException("User ID must not be null");
                User athlete = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                return userService.getDashboardSummary(athlete.getUsername(), startDate, endDate);
        }

        public double getWeeklyProgress(Long userId, LocalDate weekStart) {
                if (userId == null)
                        throw new IllegalArgumentException("User ID must not be null");
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                WeeklyPlan plan = weeklyPlanRepo
                                .findByUserAndWeekStartDate(user, weekStart)
                                .orElse(null);

                if (plan == null)
                        return 0;

                long total = plan.getWorkouts().size();

                if (total == 0)
                        return 0;

                long completed = plan.getWorkouts()
                                .stream()
                                .filter(WorkoutPlan::isCompleted)
                                .count();

                return calculationService.calculatePercentage(completed, total);
        }

        public WeeklyDashboardDTO getWeeklyDashboard(String username) {

                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                WeeklyPlan plan = weeklyPlanRepo
                                .findTopByUserOrderByWeekStartDateDesc(user)
                                .orElseThrow(() -> new RuntimeException("No weekly plan"));

                WeeklyDashboardDTO dto = new WeeklyDashboardDTO();
                dto.setWeekStartDate(plan.getWeekStartDate());
                dto.setLocked(plan.isLocked());
                dto.setWorkouts(plan.getWorkouts().stream().map(this::mapToWorkoutResponseDTO)
                                .collect(Collectors.toList()));
                dto.setProgress(calculateWeeklyProgress(plan));

                return dto;
        }

        private WorkoutResponseDTO mapToWorkoutResponseDTO(WorkoutPlan workout) {
                WorkoutResponseDTO dto = new WorkoutResponseDTO();
                dto.setId(workout.getId());
                dto.setWorkoutName(workout.getWorkoutName());
                dto.setSets(workout.getSets());
                dto.setReps(workout.getReps());
                dto.setDuration(workout.getDuration());
                dto.setCompleted(workout.isCompleted());
                dto.setWorkoutDate(workout.getWorkoutDate());
                dto.setCompletedDate(workout.getCompletedDate());
                return dto;
        }

        public double calculateWeeklyProgress(WeeklyPlan plan) {

                long total = plan.getWorkouts().size();

                if (total == 0)
                        return 0;

                long completed = plan.getWorkouts()
                                .stream()
                                .filter(w -> Boolean.TRUE.equals(w.isCompleted()))
                                .count();

                return calculationService.calculatePercentage(completed, total);
        }

        public List<TrainerProfileDTO> getSuggestedTrainers(String goal) {
                List<TrainerProfile> allTrainers = trainerProfileRepository.findAll();
                // Simple logic: if specialization matches goal, or general
                return allTrainers.stream()
                                .filter(t -> goal == null || t.getSpecialization() == null ||
                                                t.getSpecialization().toLowerCase().contains(goal.toLowerCase()))
                                .map(t -> {
                                        TrainerProfileDTO dto = new TrainerProfileDTO();
                                        dto.setId(t.getUser().getId());
                                        dto.setUsername(t.getUser().getUsername());
                                        dto.setSpecialization(t.getSpecialization());
                                        dto.setExperienceYears(t.getExperienceYears());
                                        dto.setAvailableHoursPerDay(t.getAvailableHoursPerDay());
                                        return dto;
                                }).collect(Collectors.toList());
        }

        public void assignTrainerToUser(String username, Long trainerId) {
                if (trainerId == null)
                        throw new IllegalArgumentException("Trainer ID must not be null");
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                User trainer = userRepository.findById(trainerId)
                                .orElseThrow(() -> new RuntimeException("Trainer not found"));

                user.setAssignedTrainer(trainer);
                userRepository.save(Objects.requireNonNull(user));
        }

}
