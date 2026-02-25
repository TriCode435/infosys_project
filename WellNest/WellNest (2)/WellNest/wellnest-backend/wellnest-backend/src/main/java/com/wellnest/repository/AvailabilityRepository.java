package com.wellnest.repository;

import com.wellnest.entity.Availability;
import com.wellnest.entity.TrainerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.DayOfWeek;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
    List<Availability> findByTrainerProfile(TrainerProfile trainerProfile);

    List<Availability> findByTrainerProfileAndDayOfWeek(TrainerProfile trainerProfile, DayOfWeek dayOfWeek);
}
