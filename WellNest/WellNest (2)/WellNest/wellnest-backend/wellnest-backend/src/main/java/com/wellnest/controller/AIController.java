package com.wellnest.controller;

import com.wellnest.service.AIService;
import com.wellnest.service.CalculationService;
import com.wellnest.service.UserService;
import com.wellnest.dto.UserProfileDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @Autowired
    private CalculationService calculationService;

    @Autowired
    private UserService userService;

    @GetMapping("/daily-tip")
    public ResponseEntity<Map<String, String>> getDailyTip() {
        return ResponseEntity.ok(Map.of("tip", aiService.getDailyHealthTip()));
    }

    @GetMapping("/bmi-analysis")
    public ResponseEntity<?> getBMIAnalysis(Authentication authentication) {
        UserProfileDTO profile = userService.getProfile(authentication.getName());
        if (profile.getHeight() == null || profile.getWeight() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Height and weight required for BMI calculation"));
        }

        double bmi = calculationService.calculateBMI(profile.getWeight(), profile.getHeight());
        String category = calculationService.getBMICategory(bmi);

        return ResponseEntity.ok(Map.of(
                "bmi", bmi,
                "category", category,
                "recommendation", "Based on your " + category + " status, we recommend focusing on " +
                        (category.equals("Normal") ? "maintenance and strength."
                                : "consistency and balanced macros.")));
    }
}
