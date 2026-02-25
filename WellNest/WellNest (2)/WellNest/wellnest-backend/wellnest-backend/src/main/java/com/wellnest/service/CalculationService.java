package com.wellnest.service;

import org.springframework.stereotype.Service;

@Service
public class CalculationService {

    public double calculatePercentage(long completed, long total) {
        if (total == 0)
            return 0;
        return (completed * 100.0) / total;
    }

    public double roundToDecimals(double value, int decimals) {
        double factor = Math.pow(10, decimals);
        return Math.round(value * factor) / factor;
    }

    public double calculateCaloriesBurned(String category, double weightKg, double durationHours) {
        double met = getMetValue(category);
        return met * weightKg * durationHours;
    }

    private double getMetValue(String category) {
        if (category == null)
            return 3.0; // Moderate effort as default
        return switch (category.toLowerCase()) {
            case "cardio", "running" -> 10.0;
            case "cycling" -> 7.5;
            case "strength", "weightlifting" -> 5.0;
            case "yoga", "stretching" -> 2.5;
            case "walking" -> 3.5;
            case "swimming" -> 8.0;
            default -> 4.0; // General calisthenics/aerobics
        };
    }

    public String formatRatio(double consumed, double target) {
        return roundToDecimals(consumed, 1) + "/" + roundToDecimals(target, 1);
    }

    public double calculateBMI(double weight, double height) {
        if (height <= 0)
            return 0;
        double heightInMeters = height / 100.0;
        return roundToDecimals(weight / (heightInMeters * heightInMeters), 1);
    }

    public String getBMICategory(double bmi) {
        if (bmi < 18.5)
            return "Underweight";
        if (bmi < 25)
            return "Normal";
        if (bmi < 30)
            return "Overweight";
        return "Obese";
    }
}
