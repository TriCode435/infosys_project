package com.wellnest.controller;

import com.wellnest.dto.FeedbackDTO;
import com.wellnest.service.FeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
public class FeedbackController {

    private final FeedbackService feedbackService;

    @PostMapping("/submit")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<FeedbackDTO> submitFeedback(@RequestBody FeedbackDTO dto) {
        return ResponseEntity.ok(feedbackService.submitFeedback(dto));
    }

    @GetMapping("/trainer/{trainerProfileId}")
    public ResponseEntity<Page<FeedbackDTO>> getTrainerFeedbacks(
            @PathVariable Long trainerProfileId,
            Pageable pageable) {
        return ResponseEntity.ok(feedbackService.getTrainerFeedbacks(trainerProfileId, pageable));
    }

    @DeleteMapping("/{feedbackId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFeedback(@PathVariable Long feedbackId) {
        feedbackService.deleteFeedback(feedbackId);
        return ResponseEntity.noContent().build();
    }
}
