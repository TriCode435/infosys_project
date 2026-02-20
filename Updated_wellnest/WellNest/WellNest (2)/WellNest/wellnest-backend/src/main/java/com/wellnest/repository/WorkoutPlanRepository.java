package com.wellnest.repository;

import com.wellnest.entity.User;
import com.wellnest.entity.WorkoutPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import java.time.LocalDate;

@Repository
public interface WorkoutPlanRepository extends JpaRepository<WorkoutPlan, Long> {
    @EntityGraph(attributePaths = { "weeklyPlan", "user" })
    List<WorkoutPlan> findByWeeklyPlan_UserAndWorkoutDate(User user, LocalDate workoutDate);

    @EntityGraph(attributePaths = { "weeklyPlan", "user" })
    List<WorkoutPlan> findByWeeklyPlan_UserAndWorkoutDateBetween(User user, LocalDate start, LocalDate end);

    List<WorkoutPlan> findByUserAndWorkoutDateBetween(User user, LocalDate start, LocalDate end);

    long countByUserAndWorkoutDateBetween(User user, LocalDate start, LocalDate end);

    long countByUserAndWorkoutDateBetweenAndCompleted(User user, LocalDate start, LocalDate end, boolean completed);

    long countByWeeklyPlan_User(User user);

    long countByWeeklyPlan_UserAndCompleted(User user, boolean completed);

    long countByWeeklyPlan_Trainer(User trainer);

    long countByWeeklyPlan_TrainerAndCompleted(User trainer, boolean completed);
}
