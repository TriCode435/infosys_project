package com.wellnest.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class WeeklyPlanRequest {

	@NotNull(message = "Week start date is required")
	private LocalDate weekStartDate;

	@Valid
	private List<WorkoutItem> workouts;

	@Valid
	private List<MealItem> meals;

	@Data
	public static class WorkoutItem {
		@NotBlank(message = "Workout name is required")
		private String workoutName;
		private Integer sets;
		private Integer reps;
		private String duration;
		private LocalDate workoutDate;
	}

	@Data
	public static class MealItem {
		@NotNull(message = "Calories target is required")
		private Double caloriesTarget;
		private Double proteinTarget;
		private Double carbsTarget;
		private Double fatsTarget;
		private LocalDate nutritionDate;
	}
}
