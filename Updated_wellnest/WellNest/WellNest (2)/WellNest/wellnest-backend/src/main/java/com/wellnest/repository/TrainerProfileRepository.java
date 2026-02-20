package com.wellnest.repository;

import com.wellnest.entity.TrainerProfile;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TrainerProfileRepository extends JpaRepository<TrainerProfile, Long> {
    Optional<TrainerProfile> findByUser(User user);

    Optional<TrainerProfile> findByUserId(Long userId);
}
