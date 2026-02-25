package com.wellnest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class TrainerProfileDTO {
    private Long id;
    private String username;
    private String fullName;

    private java.util.List<String> specializations;

    @NotNull(message = "Available hours per day is required")
    @Min(value = 1, message = "Available hours must be at least 1")
    private Integer availableHoursPerDay;

    @NotNull(message = "Experience years is required")
    @Min(value = 0, message = "Experience years cannot be negative")
    private Integer experienceYears;

    private String bio;
    private Double pricePerSession;
    private String profileImage;

    @com.fasterxml.jackson.annotation.JsonProperty("isAvailable")
    private boolean isAvailable;
}
