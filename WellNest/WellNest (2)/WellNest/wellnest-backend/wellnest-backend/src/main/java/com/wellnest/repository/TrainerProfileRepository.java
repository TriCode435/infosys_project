package com.wellnest.repository;

import com.wellnest.entity.TrainerProfile;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
        Optional<TrainerProfile> findByUser(User user);

        Optional<TrainerProfile> findByUserId(Long userId);

        @org.springframework.data.jpa.repository.Query("SELECT tp FROM TrainerProfile tp LEFT JOIN tp.specializations s "
                        +
                        "WHERE (:goal IS NULL OR LOWER(s) LIKE LOWER(CONCAT('%', :goal, '%'))) " +
                        "AND (:minRating IS NULL OR tp.averageRating >= :minRating) " +
                        "AND (:availableOnly = false OR tp.isAvailable = true) " +
                        "AND (:maxPrice IS NULL OR tp.pricePerSession <= :maxPrice)")
        org.springframework.data.domain.Page<TrainerProfile> searchTrainers(
                        @org.springframework.data.repository.query.Param("goal") String goal,
                        @org.springframework.data.repository.query.Param("minRating") Double minRating,
                        @org.springframework.data.repository.query.Param("availableOnly") boolean availableOnly,
                        @org.springframework.data.repository.query.Param("maxPrice") Double maxPrice,
                        org.springframework.data.domain.Pageable pageable);
}
