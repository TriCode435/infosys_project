package com.wellnest.repository;

import com.wellnest.entity.SleepMood;
import com.wellnest.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public interface SleepMoodRepository extends JpaRepository<SleepMood, Long> {
    List<SleepMood> findByProfile(UserProfile profile);

    List<SleepMood> findByProfileAndDate(UserProfile profile, LocalDate date);

    List<SleepMood> findByProfileAndDateBetween(UserProfile profile, LocalDate start, LocalDate end);

    boolean existsByProfileAndDate(UserProfile profile, LocalDate date);
}
