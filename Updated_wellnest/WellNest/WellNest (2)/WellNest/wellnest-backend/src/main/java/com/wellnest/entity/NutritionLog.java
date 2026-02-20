package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "nutrition_logs", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "user_id", "nutritionDate" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NutritionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate nutritionDate;
    private Double proteinConsumed;
    private Double carbsConsumed;
    private Double fatsConsumed;
    private Double caloriesConsumed;
    private Double waterIntake;
    private Integer steps;
    @Builder.Default
    private Integer stepsTarget = 10000;
    private Double sleepHours;
    private String mood;
}
