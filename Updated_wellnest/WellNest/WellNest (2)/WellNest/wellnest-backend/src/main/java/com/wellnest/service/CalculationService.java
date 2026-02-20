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

    public String formatRatio(double consumed, double target) {
        return roundToDecimals(consumed, 1) + "/" + roundToDecimals(target, 1);
    }
}
