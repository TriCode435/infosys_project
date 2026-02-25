package com.wellnest.config;

import com.wellnest.entity.Role;
import com.wellnest.entity.User;
import com.wellnest.entity.UserProfile;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.repository.UserRepository;
import com.wellnest.repository.UserProfileRepository;
import com.wellnest.repository.TrainerProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Objects;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private TrainerProfileRepository trainerProfileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Seed Admin
            User adminUser = User.builder()
                    .username("admin")
                    .email("admin@wellnest.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(Objects.requireNonNull(adminUser));

            // Seed Trainer
            User trainerUser = User.builder()
                    .username("trainer")
                    .email("trainer@wellnest.com")
                    .password(passwordEncoder.encode("trainer123"))
                    .role(Role.TRAINER)
                    .build();
            User savedTrainer = Objects.requireNonNull(userRepository.save(Objects.requireNonNull(trainerUser)));

            TrainerProfile trainerProfile = TrainerProfile.builder()
                    .user(savedTrainer)
                    .specialization("General Fitness")
                    .experienceYears(5)
                    .availableHoursPerDay(8)
                    .build();
            trainerProfileRepository.save(Objects.requireNonNull(trainerProfile));

            // Seed User
            User regularUser = User.builder()
                    .username("user")
                    .email("user@wellnest.com")
                    .password(passwordEncoder.encode("user123"))
                    .role(Role.USER)
                    .build();
            User savedUser = Objects.requireNonNull(userRepository.save(Objects.requireNonNull(regularUser)));

            UserProfile userProfile = UserProfile.builder()
                    .user(savedUser)
                    .fullName("John Doe")
                    .age(28)
                    .gender("Male")
                    .height(180.0)
                    .weight(75.5)
                    .fitnessGoal("Weight Loss")
                    .build();
            userProfileRepository.save(Objects.requireNonNull(userProfile));
        }
    }
}
