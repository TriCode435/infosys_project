package com.wellnest.controller;

import com.wellnest.dto.BookingDTO;
import com.wellnest.entity.BookingStatus;
import com.wellnest.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO dto) {
        // In a real app, duration might come from trainer's availability setup
        return ResponseEntity
                .ok(bookingService.createBooking(dto.getUserId(), dto.getTrainerId(), dto.getStartTime(), 60));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId));
    }

    @GetMapping("/trainer/{trainerProfileId}")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<List<BookingDTO>> getTrainerBookings(@PathVariable Long trainerProfileId) {
        return ResponseEntity.ok(bookingService.getTrainerBookings(trainerProfileId));
    }

    @PutMapping("/{bookingId}/status")
    @PreAuthorize("hasRole('TRAINER') or hasRole('ADMIN')")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(bookingId, status));
    }
}
