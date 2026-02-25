package com.wellnest.repository;

import com.wellnest.entity.NutritionAssignment;
import com.wellnest.entity.WeeklyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;

@Repository
public interface NutritionAssignmentRepository extends JpaRepository<NutritionAssignment, Long> {
    @EntityGraph(attributePaths = { "weeklyPlan" })
    List<NutritionAssignment> findByWeeklyPlan(WeeklyPlan weeklyPlan);

    Optional<NutritionAssignment> findByWeeklyPlanAndNutritionDate(com.wellnest.entity.WeeklyPlan plan,
            java.time.LocalDate date);

    Optional<NutritionAssignment> findByWeeklyPlan_IdAndNutritionDate(Long weeklyPlanId, java.time.LocalDate date);

    @EntityGraph(attributePaths = { "weeklyPlan" })
    List<NutritionAssignment> findByWeeklyPlan_UserAndNutritionDateBetween(com.wellnest.entity.User user,
            LocalDate startDate, LocalDate endDate);
}
