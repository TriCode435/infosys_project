package com.wellnest.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;
import java.time.LocalDate;

@Data
public class NutritionLogDTO {
    private Long id;

    @PositiveOrZero(message = "Calories must be positive or zero")
    private Double caloriesConsumed;
    private Double proteinConsumed;
    private Double carbsConsumed;
    private Double fatsConsumed;
    private Double waterIntake;
    private Integer steps;
    private Integer stepsTarget;

    @NotNull(message = "Date is required")
    private LocalDate nutritionDate;
}
