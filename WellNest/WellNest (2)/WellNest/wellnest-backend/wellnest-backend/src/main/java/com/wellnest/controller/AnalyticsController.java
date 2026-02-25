package com.wellnest.controller;

import com.wellnest.dto.DashboardSummaryDTO;
import com.wellnest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private UserService userService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDetailedAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            Authentication authentication) {

        if (startDate == null)
            startDate = LocalDate.now().minusDays(30);
        if (endDate == null)
            endDate = LocalDate.now();

        return ResponseEntity.ok(userService.getDashboardSummary(authentication.getName(), startDate, endDate));
    }
}
