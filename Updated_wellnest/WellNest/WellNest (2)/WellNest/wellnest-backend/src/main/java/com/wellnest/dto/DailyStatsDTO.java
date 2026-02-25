package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DailyStatsDTO {
    private LocalDate date;
    private double caloriesConsumed;
    private double caloriesTarget;
    private double waterConsumed;
    private double sleepHours;
    private int workoutsCompleted;
    private int steps;
}
