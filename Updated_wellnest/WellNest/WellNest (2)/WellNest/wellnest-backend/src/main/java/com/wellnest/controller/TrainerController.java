package com.wellnest.controller;

import com.wellnest.dto.TrainerProfileDTO;
import com.wellnest.dto.WeeklyPlanRequest;
import com.wellnest.service.TrainerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import jakarta.validation.Valid;
import java.security.Principal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/trainer")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        return ResponseEntity.ok(trainerService.getTrainerProfile(authentication.getName()));
    }

    @GetMapping("/assigned-users")
    public ResponseEntity<?> getAssignedUsers(Authentication authentication) {
        return ResponseEntity.ok(trainerService.getAssignedUsers(authentication.getName()));
    }

    @GetMapping("/users/{userId}/profile")
    public ResponseEntity<?> getAthleteProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(trainerService.getAthleteProfile(userId));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody TrainerProfileDTO dto, Authentication authentication) {
        trainerService.updateTrainerProfile(authentication.getName(), dto);
        return ResponseEntity.ok(Map.of("message", "Trainer profile updated successfully"));
    }

    @PostMapping("/users/{userId}/assign-weekly-plan")
    public ResponseEntity<?> assignWeeklyPlan(
            @PathVariable Long userId,
            @Valid @RequestBody WeeklyPlanRequest request,
            Authentication authentication) {

        trainerService.assignWeeklyPlan(authentication.getName(), userId, request);
        return ResponseEntity.ok(Map.of("message", "Weekly Plan Assigned Successfully"));
    }

    @PostMapping("/users/{userId}/clone-last-week")
    public ResponseEntity<?> cloneLastWeek(
            @PathVariable Long userId,
            @RequestParam String newWeekStart,
            Principal principal) {

        trainerService.cloneLastWeek(
                principal.getName(),
                userId,
                LocalDate.parse(newWeekStart));

        return ResponseEntity.ok("Last week cloned successfully");
    }

    @GetMapping("/users/{userId}/weekly-progress")
    public ResponseEntity<?> getWeeklyProgress(
            @PathVariable Long userId,
            @RequestParam String weekStart) {

        return ResponseEntity.ok(
                trainerService.getWeeklyProgress(userId, LocalDate.parse(weekStart)));
    }

    @GetMapping("/users/{userId}/dashboard-stats")
    public ResponseEntity<?> getAthleteDashboardStats(
            @PathVariable Long userId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(trainerService.getAthleteDashboardStats(userId, startDate, endDate));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getTrainerStats(Authentication authentication) {
        return ResponseEntity.ok(trainerService.getTrainerStats(authentication.getName()));
    }

}
