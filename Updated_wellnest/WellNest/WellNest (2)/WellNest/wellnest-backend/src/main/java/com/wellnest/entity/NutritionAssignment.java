package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double caloriesTarget;
    private Double proteinTarget;
    private Double carbsTarget;
    private Double fatsTarget;
    private LocalDate nutritionDate;

    @ManyToOne
    @JoinColumn(name = "weekly_plan_id")
    @JsonIgnore
    private WeeklyPlan weeklyPlan;
}
