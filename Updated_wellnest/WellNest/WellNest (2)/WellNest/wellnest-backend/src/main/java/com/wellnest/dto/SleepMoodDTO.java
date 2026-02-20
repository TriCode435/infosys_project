package com.wellnest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class SleepMoodDTO {
    private Long id;

    @Min(value = 0, message = "Sleep hours cannot be negative")
    @Max(value = 24, message = "Sleep hours cannot exceed 24")
    private Double sleepHours;

    private String mood;

    @Min(value = 1)
    @Max(value = 10)
    private Integer stressLevel;

    @NotNull(message = "Date is required")
    private LocalDate date;
}
