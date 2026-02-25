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

    @Autowired
    private com.wellnest.repository.BlogPostRepository blogPostRepository;

    @Autowired
    private com.wellnest.repository.BlogReportRepository blogReportRepository;

    @Autowired
    private com.wellnest.repository.WorkoutPlanRepository workoutPlanRepository;

    @Autowired
    private com.wellnest.repository.NutritionLogRepository nutritionLogRepository;

    @Autowired
    private com.wellnest.repository.BookingRepository bookingRepository;

    public List<UserProfileDTO> getAllUsersByRole(String role) {
        Role roleEnum = Role.valueOf(role);
        return userRepository.findByRole(roleEnum).stream()
                .map(u -> userService.getProfile(u.getUsername()))
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

    public com.wellnest.dto.AdminSummaryDTO getPlatformStats() {
        return com.wellnest.dto.AdminSummaryDTO.builder()
                .totalUsers(userRepository.countByRole(Role.USER))
                .totalTrainers(userRepository.countByRole(Role.TRAINER))
                .totalWorkoutsLogged(workoutPlanRepository.count())
                .totalNutritionLogs(nutritionLogRepository.count())
                .totalBlogs(blogPostRepository.count())
                .pendingBlogs(blogPostRepository.countByStatus(com.wellnest.entity.BlogStatus.PENDING))
                .totalReports(blogReportRepository.countByResolvedFalse())
                .totalBookings(bookingRepository.count())
                .userGrowth(new java.util.HashMap<>()) // Placeholder
                .averageCompliance(new java.util.HashMap<>()) // Placeholder
                .build();
    }
}
