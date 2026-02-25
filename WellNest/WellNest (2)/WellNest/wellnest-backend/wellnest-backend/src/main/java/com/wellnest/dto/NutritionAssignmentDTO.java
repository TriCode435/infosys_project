package com.wellnest.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class NutritionAssignmentDTO {
    private Long id;
    private Double caloriesTarget;
    private Double proteinTarget;
    private Double carbsTarget;
    private Double fatsTarget;
    private LocalDate nutritionDate;
}
