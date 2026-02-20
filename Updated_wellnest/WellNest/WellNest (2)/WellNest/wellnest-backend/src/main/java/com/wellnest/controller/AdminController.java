package com.wellnest.controller;

import com.wellnest.service.AdminService;
import com.wellnest.service.TipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private TipService tipService;

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(adminService.getAllUsersByRole("USER"));
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
    }

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignTrainer(@RequestParam Long trainerId, @RequestParam Long userId) {
        adminService.assignTrainer(userId, trainerId);
        return ResponseEntity.ok(Map.of("message", "Trainer assigned successfully"));
    }

    @GetMapping("/trainers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTrainers() {
        return ResponseEntity.ok(adminService.getAllUsersByRole("TRAINER"));
    }

    @PostMapping("/tips")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addTip(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tipService.createTip(body.get("content")));
    }

    @DeleteMapping("/tips/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTip(@PathVariable Long id) {
        tipService.deleteTip(id);
        return ResponseEntity.ok(Map.of("message", "Tip deleted successfully"));
    }

    @GetMapping("/tips")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTips() {
        return ResponseEntity.ok(tipService.getAllTips());
    }
}
