package com.wellnest.entity;

import java.time.LocalDate;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlan {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String workoutName;
	private Integer sets;
	private Integer reps;
	private String duration;
	@Builder.Default
	private boolean completed = false;
	private LocalDate completedDate;
	private LocalDate workoutDate;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "weekly_plan_id")
	@JsonIgnore
	private WeeklyPlan weeklyPlan;
}
