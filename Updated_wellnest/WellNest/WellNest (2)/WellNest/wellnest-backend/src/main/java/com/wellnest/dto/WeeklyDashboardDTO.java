package com.wellnest.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.Data;

@Data
public class WeeklyDashboardDTO {
	private LocalDate weekStartDate;
	private double progress;
	private Boolean locked;
	private List<WorkoutResponseDTO> workouts;
}
