package com.wellnest.service;

import com.wellnest.dto.*;
import com.wellnest.entity.*;
import com.wellnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private SleepMoodRepository sleepMoodRepository;

    @Autowired
    @org.springframework.context.annotation.Lazy
    private TrainerService trainerService;

    @Autowired
    private StreakService streakService;

    @Autowired
    private CalculationService calculationService;

    @Autowired
    private WeeklyPlanRepository weeklyPlanRepository;

    public UserProfileDTO getProfile(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);

        UserProfileDTO dto = new UserProfileDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        if (profile != null) {
            dto.setFullName(profile.getFullName());
            dto.setAge(profile.getAge());
            dto.setGender(profile.getGender());
            dto.setHeight(profile.getHeight());
            dto.setWeight(profile.getWeight());
            dto.setFitnessGoal(profile.getFitnessGoal());
            dto.setTargetWeight(profile.getTargetWeight());
            dto.setTargetTimeWeeks(profile.getTargetTimeWeeks());
            dto.setMedicalNotes(profile.getMedicalNotes());
        }
        dto.setRole(user.getRole());
        return dto;
    }

    public void updateProfile(String username, UserProfileDTO dto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        profile.setFullName(dto.getFullName());
        profile.setAge(dto.getAge());
        profile.setGender(dto.getGender());
        profile.setHeight(dto.getHeight());
        profile.setWeight(dto.getWeight());
        profile.setFitnessGoal(dto.getFitnessGoal());
        profile.setMedicalNotes(dto.getMedicalNotes());

        if (dto.getFitnessGoal() != null &&
                (dto.getFitnessGoal().equalsIgnoreCase("Weight Loss") ||
                 dto.getFitnessGoal().equalsIgnoreCase("Muscle Gain"))) {

            profile.setTargetWeight(dto.getTargetWeight());
            profile.setTargetTimeWeeks(dto.getTargetTimeWeeks());

        } else {
            profile.setTargetWeight(null);
            profile.setTargetTimeWeeks(null);
        }

        userProfileRepository.save(Objects.requireNonNull(profile));
    }

    @Autowired
    private WorkoutRepository workoutRepository;

    public List<WorkoutResponseDTO> getWorkouts(String username, LocalDate date, LocalDate startDate,
            LocalDate endDate) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));

        if (startDate == null && endDate == null) {
            if (date != null) {
                startDate = date;
                endDate = date;
            } else {
                startDate = LocalDate.now();
                endDate = startDate;
            }
        }

        List<Workout> logs = workoutRepository.findByUserAndDateBetween(user, startDate, endDate);
        List<WorkoutPlan> assignments = workoutPlanRepository.findByUserAndWorkoutDateBetween(user, startDate, endDate);

        List<WorkoutResponseDTO> response = new java.util.ArrayList<>();

        // Logged workouts
        logs.forEach(log -> response.add(mapWorkoutToDTO(log)));

        // Assigned workouts
        assignments.forEach(plan -> response.add(mapToWorkoutDTOFromPlan(plan)));

        return response;
    }

    public void deleteWorkout(Long id, String username) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        Workout workout = workoutRepository.findById(id).orElseThrow(() -> new RuntimeException("Workout not found"));
        if (!workout.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        workoutRepository.delete(workout);
    }

    @Autowired
    private NutritionLogRepository nutritionLogRepository;

    @Autowired
    private NutritionAssignmentRepository nutritionAssignmentRepository;

    public List<NutritionLogDTO> getNutritionLogs(String username, LocalDate date, LocalDate startDate,
            LocalDate endDate) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        List<NutritionLog> logs;
        if (startDate != null && endDate != null) {
            logs = nutritionLogRepository.findByUserAndNutritionDateBetween(user, startDate, endDate);
        } else if (date != null) {
            logs = nutritionLogRepository.findByUserAndNutritionDate(user, date).stream().toList();
        } else {
            logs = nutritionLogRepository.findByUser(user);
        }
        return logs.stream().map(this::mapToNutritionLogDTO).collect(Collectors.toList());
    }

    public void logNutrition(String username, NutritionLogDTO dto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        LocalDate logDate = dto.getNutritionDate() != null ? dto.getNutritionDate() : LocalDate.now();

        NutritionLog log = nutritionLogRepository.findByUserAndNutritionDate(user, logDate).orElse(null);

        if (log == null) {
            log = new NutritionLog();
            log.setUser(user);
            log.setNutritionDate(logDate);
            log.setCaloriesConsumed(0.0);
            log.setProteinConsumed(0.0);
            log.setCarbsConsumed(0.0);
            log.setFatsConsumed(0.0);
            log.setWaterIntake(0.0);
            log.setSteps(0);
            log.setStepsTarget(dto.getStepsTarget() != null ? dto.getStepsTarget() : 10000);
        }

        if (dto.getCaloriesConsumed() != null)
            log.setCaloriesConsumed(dto.getCaloriesConsumed());
        if (dto.getProteinConsumed() != null)
            log.setProteinConsumed(dto.getProteinConsumed());
        if (dto.getCarbsConsumed() != null)
            log.setCarbsConsumed(dto.getCarbsConsumed());
        if (dto.getFatsConsumed() != null)
            log.setFatsConsumed(dto.getFatsConsumed());
        if (dto.getWaterIntake() != null)
            log.setWaterIntake(dto.getWaterIntake());
        if (dto.getSteps() != null)
            log.setSteps(dto.getSteps());

        nutritionLogRepository.save(Objects.requireNonNull(log));
        streakService.updateStreak(user, logDate);
    }

    public void deleteNutritionLog(Long id, String username) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        NutritionLog log = nutritionLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        if (!log.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        nutritionLogRepository.delete(log);
    }

    public void logAdHocWorkout(String username, WorkoutResponseDTO dto) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        Workout workout = Workout.builder()
                .name(dto.getWorkoutName())
                .durationMinutes(
                        dto.getDuration() != null ? Integer.parseInt(dto.getDuration().replace(" min", "")) : 0)
                .caloriesBurned(dto.getCaloriesBurned())
                .date(dto.getWorkoutDate() != null ? dto.getWorkoutDate() : LocalDate.now())
                .category(dto.getCategory())
                .user(Objects.requireNonNull(user))
                .build();
        workoutRepository.save(Objects.requireNonNull(workout));
        streakService.updateStreak(user, LocalDate.now());
    }

    public List<SleepMoodDTO> getSleepMood(String username, LocalDate date, LocalDate startDate, LocalDate endDate) {
        UserProfile profile = getProfileEntity(username);
        List<SleepMood> entries;
        if (startDate != null && endDate != null) {
            entries = sleepMoodRepository.findByProfileAndDateBetween(profile, startDate, endDate);
        } else if (date != null) {
            entries = sleepMoodRepository.findByProfileAndDate(profile, date);
        } else {
            entries = sleepMoodRepository.findByProfile(profile);
        }
        return entries.stream().map(this::mapToSleepMoodDTO).collect(Collectors.toList());
    }

    public void logSleepMood(SleepMoodDTO dto, String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = userProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));

        LocalDate logDate = dto.getDate() != null ? dto.getDate() : LocalDate.now();

        SleepMood entry = sleepMoodRepository.findByProfileAndDate(profile, logDate).stream().findFirst().orElse(null);
        if (entry == null) {
            entry = new SleepMood();
            entry.setProfile(profile);
            entry.setDate(logDate);
        }

        entry.setSleepHours(dto.getSleepHours());
        entry.setMood(dto.getMood());
        entry.setStressLevel(dto.getStressLevel());
        sleepMoodRepository.save(Objects.requireNonNull(entry));
    }

    public void deleteSleepMood(Long id, String username) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        SleepMood entry = sleepMoodRepository.findById(id).orElseThrow(() -> new RuntimeException("Entry not found"));
        if (!entry.getProfile().getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized");
        }
        sleepMoodRepository.delete(entry);
    }

    private UserProfile getProfileEntity(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        return userProfileRepository.findByUser(user).orElseThrow(() -> new RuntimeException("Profile not found"));
    }

    private WorkoutResponseDTO mapWorkoutToDTO(Workout workout) {
        WorkoutResponseDTO dto = new WorkoutResponseDTO();
        dto.setId(workout.getId());
        dto.setWorkoutName(workout.getName());
        dto.setExerciseName(workout.getName()); // Alias
        dto.setDuration(workout.getDurationMinutes() + " min");
        dto.setTargetTime(workout.getDurationMinutes() + " min"); // Alias
        dto.setCaloriesBurned(workout.getCaloriesBurned());
        dto.setWorkoutDate(workout.getDate());
        dto.setDate(workout.getDate()); // Frontend expected field
        dto.setCategory(workout.getCategory());
        dto.setCompleted(true);
        dto.setPlan(false);
        return dto;
    }

    private NutritionLogDTO mapToNutritionLogDTO(NutritionLog log) {
        NutritionLogDTO dto = new NutritionLogDTO();
        dto.setId(log.getId());
        dto.setCaloriesConsumed(log.getCaloriesConsumed());
        dto.setProteinConsumed(log.getProteinConsumed());
        dto.setCarbsConsumed(log.getCarbsConsumed());
        dto.setFatsConsumed(log.getFatsConsumed());
        dto.setWaterIntake(log.getWaterIntake());
        dto.setSteps(log.getSteps());
        dto.setStepsTarget(log.getStepsTarget());
        dto.setNutritionDate(log.getNutritionDate());
        return dto;
    }

    private SleepMoodDTO mapToSleepMoodDTO(SleepMood entry) {
        SleepMoodDTO dto = new SleepMoodDTO();
        dto.setId(entry.getId());
        dto.setSleepHours(entry.getSleepHours());
        dto.setMood(entry.getMood());
        dto.setStressLevel(entry.getStressLevel());
        dto.setDate(entry.getDate());
        return dto;
    }

    public TrainerProfileDTO getAssignedTrainer(String username) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        User trainer = user.getAssignedTrainer();

        if (trainer == null)
            return null;

        TrainerProfileDTO dto = trainerService.getTrainerProfile(trainer.getUsername());
        dto.setUsername(trainer.getUsername());
        return dto;
    }

    @Autowired
    private WorkoutPlanRepository workoutPlanRepository;

    public void completeWorkout(Long workoutId) {
        if (workoutId == null)
            throw new IllegalArgumentException("Workout ID must not be null");
        WorkoutPlan workout = workoutPlanRepository.findById(workoutId)
                .orElseThrow(() -> new RuntimeException("Workout not found"));

        if (Boolean.TRUE.equals(workout.isCompleted())) {
            throw new RuntimeException("Workout already completed");
        }

        // Only check lock if it's a plan workout
        if (workout.getWeeklyPlan() != null && Boolean.TRUE.equals(workout.getWeeklyPlan().isLocked())) {
            throw new RuntimeException("Week is locked");
        }

        workout.setCompleted(true);
        workout.setCompletedDate(LocalDate.now());

        workoutPlanRepository.save(Objects.requireNonNull(workout));

        User user = workout.getUser();
        if (user == null && workout.getWeeklyPlan() != null) {
            user = workout.getWeeklyPlan().getUser();
        }

        if (user != null) {
            streakService.updateStreak(user, LocalDate.now());
        }
    }

    public NutritionDetailsDTO getNutritionByDate(String username, LocalDate date) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        WeeklyPlanResponseDTO planDto = getLatestWeeklyPlan(username);

        NutritionAssignment assignment = null;
        if (planDto != null) {
            // We need the actual entity or find by ID
            assignment = nutritionAssignmentRepository.findByWeeklyPlan_IdAndNutritionDate(planDto.getId(), date)
                    .orElse(null);
        }

        NutritionLog log = nutritionLogRepository.findByUserAndNutritionDate(user, date).orElse(new NutritionLog());

        double pTarget = assignment != null
                ? (assignment.getProteinTarget() != null ? assignment.getProteinTarget() : 0)
                : 0;
        double cTarget = assignment != null ? (assignment.getCarbsTarget() != null ? assignment.getCarbsTarget() : 0)
                : 0;
        double fTarget = assignment != null ? (assignment.getFatsTarget() != null ? assignment.getFatsTarget() : 0) : 0;
        double calTarget = assignment != null
                ? (assignment.getCaloriesTarget() != null ? assignment.getCaloriesTarget() : 0)
                : 0;

        double pCons = log.getProteinConsumed() != null ? log.getProteinConsumed() : 0;
        double cCons = log.getCarbsConsumed() != null ? log.getCarbsConsumed() : 0;
        double fCons = log.getFatsConsumed() != null ? log.getFatsConsumed() : 0;
        double calCons = log.getCaloriesConsumed() != null ? log.getCaloriesConsumed() : 0;
        double waterCons = log.getWaterIntake() != null ? log.getWaterIntake() : 0;

        return NutritionDetailsDTO.builder()
                .proteinTarget(pTarget)
                .proteinConsumed(pCons)
                .proteinRatio(calculationService.formatRatio(pCons, pTarget))
                .carbsTarget(cTarget)
                .carbsConsumed(cCons)
                .carbsRatio(calculationService.formatRatio(cCons, cTarget))
                .fatsTarget(fTarget)
                .fatsConsumed(fCons)
                .fatsRatio(calculationService.formatRatio(fCons, fTarget))
                .caloriesTarget(calTarget)
                .caloriesConsumed(calCons)
                .caloriesRatio(calculationService.formatRatio(calCons, calTarget))
                .waterIntake(waterCons)
                .steps(log.getSteps() != null ? log.getSteps() : 0)
                .stepsTarget(log.getStepsTarget() != null ? log.getStepsTarget() : 10000)
                .build();
    }

    public DashboardSummaryDTO getDashboardSummary(String username, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("User not found"));
        // If no dates provided, default to today
        if (startDate == null)
            startDate = LocalDate.now();
        if (endDate == null)
            endDate = startDate;

        UserProfile profile = userProfileRepository.findByUser(user).orElse(null);

        // 1. Workouts Calculation (WeeklyPlan + Ad-hoc)
        long assignedWorkouts = workoutPlanRepository.countByUserAndWorkoutDateBetween(user, startDate, endDate);
        long completedAssigned = workoutPlanRepository.countByUserAndWorkoutDateBetweenAndCompleted(user, startDate,
                endDate, true);

        long adHocWorkouts = workoutRepository.countByUserAndDateBetween(user, startDate, endDate);

        long totalWorkouts = assignedWorkouts + adHocWorkouts;
        long completedWorkouts = completedAssigned + adHocWorkouts;

        // 2. Sleep Calculation
        double avgSleep = 0;
        double todaySleep = 0;
        String latestMood = "Neutral";
        if (profile != null) {
            List<SleepMood> sleepLogs = sleepMoodRepository.findByProfileAndDateBetween(profile, startDate, endDate);
            if (!sleepLogs.isEmpty()) {
                avgSleep = sleepLogs.stream().mapToDouble(SleepMood::getSleepHours).average().orElse(0);
                SleepMood latest = sleepLogs.get(sleepLogs.size() - 1);
                latestMood = latest.getMood();
                todaySleep = latest.getSleepHours();
            }
        }

        // 3. Nutrition Calculation
        List<NutritionLog> nutritionLogs = nutritionLogRepository.findByUserAndNutritionDateBetween(user, startDate,
                endDate);
        double calCons = 0, pCons = 0, cCons = 0, fCons = 0, waterCons = 0;
        int stepsCons = 0;

        for (NutritionLog log : nutritionLogs) {
            calCons += (log.getCaloriesConsumed() != null ? log.getCaloriesConsumed() : 0);
            pCons += (log.getProteinConsumed() != null ? log.getProteinConsumed() : 0);
            cCons += (log.getCarbsConsumed() != null ? log.getCarbsConsumed() : 0);
            fCons += (log.getFatsConsumed() != null ? log.getFatsConsumed() : 0);
            waterCons += (log.getWaterIntake() != null ? log.getWaterIntake() : 0);
            stepsCons += (log.getSteps() != null ? log.getSteps() : 0);
        }

        // Calculate Targets
        double calTarget = 0, waterTarget = 0, pTarget = 0, cTarget = 0, fTarget = 0;
        int stepsTarget = 0;

        // Efficiently fetch all relevant plans and assignments in the range
        List<NutritionAssignment> allAssignments = nutritionAssignmentRepository
                .findByWeeklyPlan_UserAndNutritionDateBetween(user, startDate, endDate);

        Map<LocalDate, NutritionAssignment> assignmentMap = allAssignments.stream()
                .collect(Collectors.toMap(NutritionAssignment::getNutritionDate, na -> na, (a, b) -> a));

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            NutritionAssignment target = assignmentMap.get(date);

            if (target != null) {
                calTarget += (target.getCaloriesTarget() != null ? target.getCaloriesTarget() : 0.0);
                pTarget += (target.getProteinTarget() != null ? target.getProteinTarget() : 0.0);
                cTarget += (target.getCarbsTarget() != null ? target.getCarbsTarget() : 0.0);
                fTarget += (target.getFatsTarget() != null ? target.getFatsTarget() : 0.0);
                waterTarget += 3.0;
                stepsTarget += 10000;
            } else {
                calTarget += 2000.0;
                pTarget += 150.0;
                cTarget += 300.0;
                fTarget += 70.0;
                waterTarget += 3.0;
                stepsTarget += 10000;
            }
        }

        // 4. Daily Stats for Charting (Bulk optimize)
        List<SleepMood> sleepLogsInRange = profile != null
                ? sleepMoodRepository.findByProfileAndDateBetween(profile, startDate, endDate)
                : List.of();

        Map<LocalDate, SleepMood> sleepMap = sleepLogsInRange.stream()
                .collect(Collectors.toMap(SleepMood::getDate, s -> s, (a, b) -> a));

        List<WorkoutPlan> workoutPlansInRange = workoutPlanRepository.findByUserAndWorkoutDateBetween(user, startDate,
                endDate);
        Map<LocalDate, List<WorkoutPlan>> workoutMapByDate = workoutPlansInRange.stream()
                .collect(Collectors.groupingBy(WorkoutPlan::getWorkoutDate));

        List<Workout> adHocInRange = workoutRepository.findByUserAndDateBetween(user, startDate, endDate);
        Map<LocalDate, Long> adHocCountByDate = adHocInRange.stream()
                .collect(Collectors.groupingBy(Workout::getDate, Collectors.counting()));

        List<DailyStatsDTO> dailyStats = new java.util.ArrayList<>();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            final LocalDate currentDate = date;
            NutritionLog dailyLog = nutritionLogs.stream()
                    .filter(l -> l.getNutritionDate().equals(currentDate))
                    .findFirst().orElse(null);

            SleepMood dailySleep = sleepMap.get(currentDate);

            long dailyWorkoutsCount = workoutMapByDate.getOrDefault(currentDate, List.of()).stream()
                    .filter(WorkoutPlan::isCompleted)
                    .count() + adHocCountByDate.getOrDefault(currentDate, 0L);

            dailyStats.add(DailyStatsDTO.builder()
                    .caloriesConsumed(dailyLog != null
                            ? (dailyLog.getCaloriesConsumed() != null ? dailyLog.getCaloriesConsumed() : 0)
                            : 0)
                    .waterConsumed(
                            dailyLog != null ? (dailyLog.getWaterIntake() != null ? dailyLog.getWaterIntake() : 0) : 0)
                    .sleepHours(
                            dailySleep != null ? (dailySleep.getSleepHours() != null ? dailySleep.getSleepHours() : 0)
                                    : 0)
                    .workoutsCompleted((int) dailyWorkoutsCount)
                    .steps(dailyLog != null ? (dailyLog.getSteps() != null ? dailyLog.getSteps() : 0) : 0)
                    .date(currentDate)
                    .build());
        }

        return DashboardSummaryDTO.builder()
                .totalWorkouts(totalWorkouts)
                .completedWorkouts(completedWorkouts)
                .percentage(calculationService.calculatePercentage(completedWorkouts, totalWorkouts))
                .streak(streakService.getCurrentVisibleStreak(user))
                .trainer(getAssignedTrainer(username))
                .avgSleep(calculationService.roundToDecimals(avgSleep, 1))
                .todaySleep(todaySleep)
                .mood(latestMood)
                .isNutritionLogged(!nutritionLogs.isEmpty())
                .caloriesConsumed(calCons)
                .caloriesTarget(calTarget)
                .proteinConsumed(pCons)
                .proteinTarget(pTarget)
                .carbsConsumed(cCons)
                .carbsTarget(cTarget)
                .fatsConsumed(fCons)
                .fatsTarget(fTarget)
                .water(waterCons)
                .waterTarget(waterTarget)
                .steps(stepsCons)
                .stepsTarget(stepsTarget)
                .dailyStats(dailyStats)
                .build();
    }

    public WeeklyPlanResponseDTO getLatestWeeklyPlan(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return weeklyPlanRepository.findTopByUserOrderByWeekStartDateDesc(user)
                .map(this::mapToWeeklyPlanResponseDTO)
                .orElse(null);
    }

    private WeeklyPlanResponseDTO mapToWeeklyPlanResponseDTO(WeeklyPlan plan) {
        WeeklyPlanResponseDTO dto = new WeeklyPlanResponseDTO();
        dto.setId(plan.getId());
        dto.setUserUsername(plan.getUser().getUsername());
        dto.setTrainerUsername(plan.getTrainer() != null ? plan.getTrainer().getUsername() : null);
        dto.setWeekStartDate(plan.getWeekStartDate());
        dto.setLocked(plan.isLocked());
        dto.setWorkouts(plan.getWorkouts().stream().map(this::mapToWorkoutDTOFromPlan).collect(Collectors.toList()));
        dto.setNutritionAssignments(plan.getNutritionAssignments().stream().map(this::mapToNutritionAssignmentDTO)
                .collect(Collectors.toList()));
        return dto;
    }

    private WorkoutResponseDTO mapToWorkoutDTOFromPlan(WorkoutPlan workout) {
        WorkoutResponseDTO dto = new WorkoutResponseDTO();
        dto.setId(workout.getId());
        dto.setWorkoutName(workout.getWorkoutName());
        dto.setExerciseName(workout.getWorkoutName()); // Alias
        dto.setSets(workout.getSets());
        dto.setReps(workout.getReps());
        dto.setTargetReps(workout.getReps()); // Alias
        dto.setDuration(workout.getDuration());
        dto.setTargetTime(workout.getDuration()); // Alias
        dto.setWorkoutDate(workout.getWorkoutDate());
        dto.setDate(workout.getWorkoutDate()); // Frontend expected field
        dto.setCompleted(workout.isCompleted());
        dto.setPlan(true);
        return dto;
    }

    private NutritionAssignmentDTO mapToNutritionAssignmentDTO(NutritionAssignment assignment) {
        NutritionAssignmentDTO dto = new NutritionAssignmentDTO();
        dto.setId(assignment.getId());
        dto.setCaloriesTarget(assignment.getCaloriesTarget());
        dto.setProteinTarget(assignment.getProteinTarget());
        dto.setCarbsTarget(assignment.getCarbsTarget());
        dto.setFatsTarget(assignment.getFatsTarget());
        dto.setNutritionDate(assignment.getNutritionDate());
        return dto;
    }
}
