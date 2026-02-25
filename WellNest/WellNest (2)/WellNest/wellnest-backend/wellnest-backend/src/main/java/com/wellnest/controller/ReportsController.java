package com.wellnest.controller;

import com.wellnest.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/weekly")
    public ResponseEntity<byte[]> getWeeklyReport(
            @RequestParam String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            org.springframework.security.core.Authentication authentication) {

        String requesterUsername = authentication.getName();
        String role = authentication.getAuthorities().iterator().next().getAuthority();

        boolean isOwnReport = requesterUsername.equals(username);
        boolean isAdmin = role.equals("ROLE_ADMIN");

        if (!isOwnReport && !isAdmin) {
            // Check if trainer has booking
            if (role.equals("ROLE_TRAINER")) {
                com.wellnest.entity.User targetUser = reportService.getUserByUsername(username);
                // Added null check for targetUser
                if (targetUser == null) {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).build();
                }
                if (!reportService.canTrainerAccessUser(requesterUsername, targetUser.getId())) {
                    return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
                }
            } else {
                return ResponseEntity.status(org.springframework.http.HttpStatus.FORBIDDEN).build();
            }
        }

        if (startDate == null)
            startDate = LocalDate.now().minusDays(7);
        byte[] reportBytes = reportService.generateWeeklyReportPdf(username, startDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report_" + username + ".pdf")
                .contentType(org.springframework.http.MediaType.parseMediaType("application/pdf"))
                .body(reportBytes);
    }
}
