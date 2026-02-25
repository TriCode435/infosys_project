package com.wellnest.repository;

import com.wellnest.entity.Badge;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BadgeRepository extends JpaRepository<Badge, Long> {
    List<Badge> findByUser(User user);

    boolean existsByUserAndName(User user, String name);
}
