package com.wellnest.service;

import com.wellnest.dto.FeedbackDTO;
import com.wellnest.entity.Booking;
import com.wellnest.entity.BookingStatus;
import com.wellnest.entity.Feedback;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.repository.BookingRepository;
import com.wellnest.repository.FeedbackRepository;
import com.wellnest.repository.TrainerProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final BookingRepository bookingRepository;
    private final TrainerProfileRepository trainerProfileRepository;

    @Transactional
    public FeedbackDTO submitFeedback(FeedbackDTO dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId())
                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));

        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new RuntimeException("Feedback can only be submitted for completed bookings");
        }

        if (feedbackRepository.existsByBookingId(booking.getId())) {
            throw new RuntimeException("Feedback already exists for this booking");
        }

        Feedback feedback = Feedback.builder()
                .booking(booking)
                .user(booking.getUser())
                .trainer(booking.getTrainer())
                .rating(dto.getRating())
                .reviewText(dto.getReviewText())
                .build();

        Feedback saved = feedbackRepository.save(feedback);
        updateTrainerAverageRating(booking.getTrainer());

        return convertToDTO(saved);
    }

    public Page<FeedbackDTO> getTrainerFeedbacks(Long trainerProfileId, Pageable pageable) {
        TrainerProfile trainer = trainerProfileRepository.findById(trainerProfileId)
                .orElseThrow(() -> new EntityNotFoundException("Trainer profile not found"));
        return feedbackRepository.findByTrainer(trainer, pageable).map(this::convertToDTO);
    }

    @Transactional
    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new EntityNotFoundException("Feedback not found"));
        TrainerProfile trainer = feedback.getTrainer();
        feedbackRepository.delete(feedback);
        updateTrainerAverageRating(trainer);
    }

    private void updateTrainerAverageRating(TrainerProfile trainer) {
        // This is a simple implementation. For large datasets, consider a more
        // efficient calculation.
        List<Feedback> feedbacks = feedbackRepository.findByTrainer(trainer, Pageable.unpaged()).getContent();
        double average = feedbacks.stream()
                .mapToInt(Feedback::getRating)
                .average()
                .orElse(0.0);
        trainer.setAverageRating(average);
        trainerProfileRepository.save(trainer);
    }

    private FeedbackDTO convertToDTO(Feedback feedback) {
        return FeedbackDTO.builder()
                .id(feedback.getId())
                .bookingId(feedback.getBooking().getId())
                .userId(feedback.getUser().getId())
                .userName(feedback.getUser().getUsername())
                .trainerId(feedback.getTrainer().getId())
                .trainerName(feedback.getTrainer().getUser().getUsername())
                .rating(feedback.getRating())
                .reviewText(feedback.getReviewText())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
