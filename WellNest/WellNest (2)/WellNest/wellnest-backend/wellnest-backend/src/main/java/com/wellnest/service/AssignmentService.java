package com.wellnest.service;

import com.wellnest.dto.AssignmentDTO;
import com.wellnest.entity.Assignment;
import com.wellnest.entity.User;
import com.wellnest.repository.AssignmentRepository;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserRepository userRepository;

    public AssignmentDTO assignTrainer(Long trainerId, Long userId) {
        if (trainerId == null || userId == null) {
            throw new IllegalArgumentException("Trainer ID and User ID must not be null");
        }
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer with ID " + trainerId + " not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User with ID " + userId + " not found"));

        if (!trainer.getRole().name().equals("TRAINER"))
            throw new RuntimeException("User is not a TRAINER");
        if (!user.getRole().name().equals("USER"))
            throw new RuntimeException("User is not a regular USER");

        Assignment assignment = Assignment.builder()
                .trainer(trainer)
                .user(user)
                .assignedDate(LocalDate.now())
                .build();

        Assignment savedAssignment = assignmentRepository.save(assignment);
        if (savedAssignment == null)
            throw new RuntimeException("Failed to save assignment");
        return mapToAssignmentDTO(savedAssignment);
    }

    public List<AssignmentDTO> getAllAssignments() {
        return assignmentRepository.findAll().stream()
                .map(this::mapToAssignmentDTO)
                .collect(Collectors.toList());
    }

    public AssignmentDTO mapToAssignmentDTO(Assignment assignment) {
        return AssignmentDTO.builder()
                .id(assignment.getId())
                .trainerId(assignment.getTrainer().getId())
                .trainerUsername(assignment.getTrainer().getUsername())
                .userId(assignment.getUser().getId())
                .userUsername(assignment.getUser().getUsername())
                .assignedDate(assignment.getAssignedDate())
                .build();
    }
}
