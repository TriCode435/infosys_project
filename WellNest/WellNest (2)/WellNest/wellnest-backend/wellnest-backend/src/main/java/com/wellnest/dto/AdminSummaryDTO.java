package com.wellnest.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class AdminSummaryDTO {
    private long totalUsers;
    private long totalTrainers;
    private long totalWorkoutsLogged;
    private long totalNutritionLogs;
    private Map<String, Long> userGrowth; // Date -> Count
    private Map<String, Double> averageCompliance; // Role -> %
    private long totalBlogs;
    private long pendingBlogs;
    private long totalReports;
    private long totalBookings;
}
