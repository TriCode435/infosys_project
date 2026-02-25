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
    @PositiveOrZero(message = "Protein must be positive or zero")
    private Double proteinConsumed;
    @PositiveOrZero(message = "Carbs must be positive or zero")
    private Double carbsConsumed;
    @PositiveOrZero(message = "Fats must be positive or zero")
    private Double fatsConsumed;
    @PositiveOrZero(message = "Water intake must be positive or zero")
    private Double waterIntake;
    @PositiveOrZero(message = "Steps must be positive or zero")
    private Integer steps;
    @PositiveOrZero(message = "Steps target must be positive or zero")
    private Integer stepsTarget;

    private Double sleepHours;
    private String mood;

    @NotNull(message = "Date is required")
    private LocalDate nutritionDate;
}
