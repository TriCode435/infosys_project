package com.wellnest.controller;

import com.wellnest.dto.UserProfileDTO;
import com.wellnest.dto.SleepMoodDTO;
import com.wellnest.dto.NutritionLogDTO;
import com.wellnest.dto.WorkoutResponseDTO;
import com.wellnest.service.UserService;
import com.wellnest.service.TrainerService;
import com.wellnest.service.TipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private TrainerService trainerService;

    @Autowired
    private TipService tipService;

    @GetMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(authentication.getName()));
    }

    @PutMapping("/profile")
    @PreAuthorize("hasAnyRole('USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserProfileDTO dto, Authentication authentication) {
        userService.updateProfile(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
    }

    @GetMapping("/workouts")
    public ResponseEntity<?> getWorkouts(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getWorkouts(authentication.getName(), date, startDate, endDate));
    }

    @DeleteMapping("/workouts/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id, Authentication authentication) {
        userService.deleteWorkout(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Workout deleted successfully"));
    }

    @GetMapping("/nutrition-logs")
    public ResponseEntity<?> getNutritionLogs(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getNutritionLogs(authentication.getName(), date, startDate, endDate));
    }

    @PostMapping("/nutrition-log")
    public ResponseEntity<?> logNutrition(@Valid @RequestBody NutritionLogDTO dto,
            Authentication authentication) {
        userService.logNutrition(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Nutrition logged successfully"));
    }

    @GetMapping("/nutrition")
    public ResponseEntity<?> getNutrition(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getNutritionByDate(authentication.getName(), date));
    }

    @DeleteMapping("/nutrition-logs/{id}")
    public ResponseEntity<?> deleteNutritionLog(@PathVariable Long id, Authentication authentication) {
        userService.deleteNutritionLog(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Nutrition log deleted successfully"));
    }

    @GetMapping("/sleep-mood")
    public ResponseEntity<?> getSleepMood(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getSleepMood(authentication.getName(), date, startDate, endDate));
    }

    @PostMapping("/sleep-mood")
    public ResponseEntity<?> logSleepMood(@Valid @RequestBody SleepMoodDTO dto, Authentication authentication) {
        userService.logSleepMood(dto, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Sleep & Mood logged successfully"));
    }

    @DeleteMapping("/sleep-mood/{id}")
    public ResponseEntity<?> deleteSleepMood(@PathVariable Long id, Authentication authentication) {
        userService.deleteSleepMood(id, authentication.getName());
        return ResponseEntity.ok(Map.of("message", "Sleep & Mood log deleted successfully"));
    }

    @GetMapping("/assigned-trainer")
    public ResponseEntity<?> getAssignedTrainer(Authentication authentication) {
        return ResponseEntity.ok(userService.getAssignedTrainer(authentication.getName()));
    }

    @GetMapping("/weekly-plan")
    public ResponseEntity<?> getWeeklyPlan(Authentication authentication) {
        return ResponseEntity.ok(userService.getLatestWeeklyPlan(authentication.getName()));
    }

    @PutMapping("/workout/{workoutId}/complete")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> completeWorkout(@PathVariable Long workoutId) {
        userService.completeWorkout(workoutId);
        return ResponseEntity.ok(Map.of("message", "Workout marked completed"));
    }

    @PostMapping("/workouts")
    public ResponseEntity<?> logWorkout(@Valid @RequestBody WorkoutResponseDTO dto,
            Authentication authentication) {
        userService.logAdHocWorkout(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Workout logged successfully"));
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<?> getDashboardSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getDashboardSummary(authentication.getName(), startDate, endDate));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboard(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {
        return ResponseEntity.ok(userService.getDashboardSummary(authentication.getName(), startDate, endDate));
    }

    @GetMapping("/trainer-suggestions")
    public ResponseEntity<?> getTrainerSuggestions(@RequestParam(required = false) String goal) {
        return ResponseEntity.ok(trainerService.getSuggestedTrainers(goal));
    }

    @PostMapping("/assign-trainer/{trainerId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> assignTrainer(@PathVariable Long trainerId, Authentication authentication) {
        trainerService.assignTrainerToUser(authentication.getName(), trainerId);
        return ResponseEntity.ok(Map.of("message", "Trainer assigned successfully"));
    }

    @GetMapping("/tip-of-the-day")
    public ResponseEntity<?> getRandomTip() {
        return ResponseEntity.ok(tipService.getRandomActiveTip());
    }
}
