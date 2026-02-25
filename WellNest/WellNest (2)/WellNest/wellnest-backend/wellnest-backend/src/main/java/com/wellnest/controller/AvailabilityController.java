package com.wellnest.controller;

import com.wellnest.dto.AvailabilityDTO;
import com.wellnest.service.AvailabilityService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/availability")
@RequiredArgsConstructor
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    @PostMapping("/trainer/{trainerProfileId}")
    @PreAuthorize("hasRole('TRAINER')")
    public ResponseEntity<List<AvailabilityDTO>> saveAvailabilities(
            @PathVariable Long trainerProfileId,
            @RequestBody List<AvailabilityDTO> availabilities) {
        return ResponseEntity.ok(availabilityService.saveAvailabilities(trainerProfileId, availabilities));
    }

    @GetMapping("/trainer/{trainerProfileId}")
    public ResponseEntity<List<AvailabilityDTO>> getTrainerAvailabilities(@PathVariable Long trainerProfileId) {
        return ResponseEntity.ok(availabilityService.getTrainerAvailabilities(trainerProfileId));
    }

    @GetMapping("/trainer/{trainerProfileId}/slots")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(
            @PathVariable Long trainerProfileId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(availabilityService.getAvailableSlots(trainerProfileId, date));
    }
}
