package com.wellnest.repository;

import com.wellnest.entity.Assignment;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByTrainer(User trainer);

    List<Assignment> findByUser(User user);

    Optional<Assignment> findByTrainerAndUser(User trainer, User user);
}
