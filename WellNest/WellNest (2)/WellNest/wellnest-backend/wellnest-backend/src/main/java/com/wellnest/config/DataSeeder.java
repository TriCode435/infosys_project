package com.wellnest.config;

import com.wellnest.entity.*;
import com.wellnest.repository.*;
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
        private CategoryRepository categoryRepository;

        @Autowired
        private BlogPostRepository blogPostRepository;

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
                        User savedTrainer = Objects
                                        .requireNonNull(userRepository.save(Objects.requireNonNull(trainerUser)));

                        TrainerProfile trainerProfile = TrainerProfile.builder()
                                        .user(savedTrainer)
                                        .specializations(java.util.List.of("General Fitness"))
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
                        User savedUser = Objects
                                        .requireNonNull(userRepository.save(Objects.requireNonNull(regularUser)));

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

                        // Seed Blog Categories
                        Category fitnessCategory = categoryRepository.save(Category.builder().name("Fitness")
                                        .description("Workout routines and tips").build());
                        Category nutritionCategory = categoryRepository.save(Category.builder().name("Nutrition")
                                        .description("Healthy eating and recipes").build());
                        categoryRepository.save(Category.builder().name("Mental Health")
                                        .description("Mindfulness and stress management").build());

                        // Seed Sample Blog Post
                        BlogPost samplePost = BlogPost.builder()
                                        .title("Top 5 Fitness Tips for Beginners")
                                        .content("<p>Welcome to your fitness journey! Here are 5 tips to get you started...</p>")
                                        .author(savedTrainer)
                                        .category(fitnessCategory)
                                        .tags(java.util.List.of("Fitness", "Beginner"))
                                        .status(BlogStatus.APPROVED)
                                        .build();
                        blogPostRepository.save(samplePost);
                }
        }
}
