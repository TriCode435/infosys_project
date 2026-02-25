package com.wellnest.dto;

import com.wellnest.entity.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserProfileDTO {
    private Long id;
    private String username;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotNull(message = "Age is required")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Height is required")
    private Double height;

    @NotNull(message = "Weight is required")
    private Double weight;

    @NotBlank(message = "Fitness goal is required")
    private String fitnessGoal;

    private String medicalNotes;
    private Double targetWeight;
    private Integer targetTimeWeeks;
    private Role role;
}
