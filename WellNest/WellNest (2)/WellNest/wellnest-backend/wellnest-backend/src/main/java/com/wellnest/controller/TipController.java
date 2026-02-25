package com.wellnest.controller;

import com.wellnest.service.TipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/tips")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TipController {

    @Autowired
    private TipService tipService;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveTips() {
        return ResponseEntity.ok(tipService.getActiveTips());
    }

    @GetMapping("/random")
    public ResponseEntity<?> getRandomTip() {
        return ResponseEntity.ok(tipService.getRandomActiveTip());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<?> createTip(@RequestBody Map<String, String> body) {
        return ResponseEntity.ok(tipService.createTip(body.get("content")));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<?> getAllTips() {
        return ResponseEntity.ok(tipService.getAllTips());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/toggle")
    public ResponseEntity<?> toggleTip(@PathVariable Long id) {
        return ResponseEntity.ok(tipService.toggleTipActivation(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTip(@PathVariable Long id) {
        tipService.deleteTip(id);
        return ResponseEntity.ok(Map.of("message", "Tip deleted successfully"));
    }
}
