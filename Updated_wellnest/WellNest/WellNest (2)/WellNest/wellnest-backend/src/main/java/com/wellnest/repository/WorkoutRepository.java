package com.wellnest.repository;

import com.wellnest.entity.Workout;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserAndDate(User user, LocalDate date);

    List<Workout> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    long countByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
