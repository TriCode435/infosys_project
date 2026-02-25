package com.wellnest.repository;

import com.wellnest.entity.User;
import com.wellnest.entity.WeeklyPlan;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeeklyPlanRepository extends JpaRepository<WeeklyPlan, Long> {

    // 🔹 Get latest weekly plan of a user
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "workouts", "nutritionAssignments" })
    Optional<WeeklyPlan> findTopByUserOrderByWeekStartDateDesc(User user);

    // 🔹 Get specific week's plan
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = { "user", "trainer" })
    Optional<WeeklyPlan> findByUserAndWeekStartDate(User user, LocalDate weekStartDate);

    // 🔹 Get all weekly plans of user
    List<WeeklyPlan> findByUser(User user);

    // 🔹 Get all unlocked weekly plans (for scheduler)
    List<WeeklyPlan> findByLockedFalse();

    // 🔹 Get all plans assigned by a trainer
    List<WeeklyPlan> findByTrainer(User trainer);

    List<WeeklyPlan> findByUserOrderByWeekStartDateDesc(User user);

}
