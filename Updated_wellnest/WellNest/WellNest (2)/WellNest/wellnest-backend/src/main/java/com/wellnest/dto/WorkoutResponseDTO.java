package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutResponseDTO {
    private Long id;
    private String workoutName;
    private Integer sets;
    private Integer reps;
    private String duration;
    private Integer caloriesBurned;
    private boolean completed;
    private LocalDate completedDate;
    private LocalDate workoutDate;
    private LocalDate date; // Added for frontend compatibility
    private String category;

    @JsonProperty("isPlan")
    private boolean isPlan;

    // Compatibility aliases
    private String exerciseName;
    private Integer targetReps;
    private String targetTime;
}
