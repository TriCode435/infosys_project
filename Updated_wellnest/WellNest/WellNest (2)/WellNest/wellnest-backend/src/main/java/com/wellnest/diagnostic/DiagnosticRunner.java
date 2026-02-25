package com.wellnest.diagnostic;

import com.wellnest.repository.UserRepository;
import com.wellnest.repository.AssignmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DiagnosticRunner implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AssignmentRepository assignmentRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DIAGNOSTIC START ===");
        System.out.println("Total Users: " + userRepository.count());
        userRepository.findAll().forEach(u -> System.out
                .println("User: ID=" + u.getId() + ", Name=" + u.getUsername() + ", Role=" + u.getRole()));

        System.out.println("Total Assignments: " + assignmentRepository.count());
        assignmentRepository.findAll().forEach(a -> System.out.println("Assignment: ID=" + a.getId() + ", TrainerID="
                + a.getTrainer().getId() + ", UserID=" + a.getUser().getId()));
        System.out.println("=== DIAGNOSTIC END ===");
    }
}
