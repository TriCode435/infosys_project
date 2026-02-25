package com.wellnest.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NutritionDetailsDTO {
    private Double proteinTarget;
    private Double proteinConsumed;
    private String proteinRatio;

    private Double carbsTarget;
    private Double carbsConsumed;
    private String carbsRatio;

    private Double fatsTarget;
    private Double fatsConsumed;
    private String fatsRatio;

    private Double caloriesTarget;
    private Double caloriesConsumed;
    private String caloriesRatio;

    private Double waterIntake;
    private Integer steps;
    private Integer stepsTarget;
}
