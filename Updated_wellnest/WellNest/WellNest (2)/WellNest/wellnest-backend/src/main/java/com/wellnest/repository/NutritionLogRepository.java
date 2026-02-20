package com.wellnest.repository;

import com.wellnest.entity.NutritionLog;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface NutritionLogRepository extends JpaRepository<NutritionLog, Long> {
    List<NutritionLog> findByUser(User user);

    Optional<NutritionLog> findByUserAndNutritionDate(User user, LocalDate nutritionDate);

    boolean existsByUserAndNutritionDate(User user, LocalDate nutritionDate);

    List<NutritionLog> findByUserAndNutritionDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
