package com.wellnest.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private long totalWorkouts;
    private long completedWorkouts;
    private double percentage;
    private int streak;
    private double avgSleep;
    private boolean isNutritionLogged;
    private int steps;
    private int stepsTarget;
    private String mood;
    private double todaySleep;
    private double caloriesConsumed;
    private double caloriesTarget;
    private double proteinConsumed;
    private double proteinTarget;
    private double carbsConsumed;
    private double carbsTarget;
    private double fatsConsumed;
    private double fatsTarget;
    private double water;
    private double waterTarget;
    private TrainerProfileDTO trainer;
    private List<DailyStatsDTO> dailyStats;
}
