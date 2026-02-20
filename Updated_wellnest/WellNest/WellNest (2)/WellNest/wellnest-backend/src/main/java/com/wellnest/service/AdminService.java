package com.wellnest.service;

import com.wellnest.dto.UserProfileDTO;
import com.wellnest.entity.User;
import com.wellnest.entity.Role;
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    public List<UserProfileDTO> getAllUsersByRole(String role) {
        Role roleEnum = Role.valueOf(role);
        return userRepository.findByRole(roleEnum).stream()
                .map(u -> {
                    UserProfileDTO dto = new UserProfileDTO();
                    dto.setId(u.getId());
                    dto.setUsername(u.getUsername());
                    dto.setRole(u.getRole());


                    if (u.getUserProfile() != null) {
                        dto.setFullName(u.getUserProfile().getFullName());
                        dto.setAge(u.getUserProfile().getAge());
                        dto.setGender(u.getUserProfile().getGender());
                        dto.setHeight(u.getUserProfile().getHeight());
                        dto.setWeight(u.getUserProfile().getWeight());
                        dto.setFitnessGoal(u.getUserProfile().getFitnessGoal());
                    }
                    return dto;
                })
                .collect(Collectors.toList());
    }
    
    public void deleteUser(Long id) {
        if (id == null)
            throw new IllegalArgumentException("ID must not be null");
        userRepository.deleteById(id);
    }

    @Transactional
    public void assignTrainer(Long userId, Long trainerId) {
        if (userId == null || trainerId == null) {
            throw new IllegalArgumentException("User ID and Trainer ID must not be null");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        User trainer = userRepository.findById(trainerId)
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        if (trainer.getRole() != Role.TRAINER) {
            throw new RuntimeException("Selected user is not a trainer");
        }

        user.setAssignedTrainer(trainer);
        userRepository.save(java.util.Objects.requireNonNull(user));
    }
}
