package com.wellnest.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class WeeklyPlanResponseDTO {
    private Long id;
    private String userUsername;
    private String trainerUsername;
    private LocalDate weekStartDate;
    private boolean locked;
    private List<WorkoutResponseDTO> workouts;
    private List<NutritionAssignmentDTO> nutritionAssignments;
}
