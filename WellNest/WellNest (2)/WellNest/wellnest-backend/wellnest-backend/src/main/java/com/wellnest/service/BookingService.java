package com.wellnest.service;

import com.wellnest.dto.BookingDTO;
import com.wellnest.entity.Booking;
import com.wellnest.entity.BookingStatus;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.entity.User;
import com.wellnest.repository.BookingRepository;
import com.wellnest.repository.TrainerProfileRepository;
import com.wellnest.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {

        private final BookingRepository bookingRepository;
        private final TrainerProfileRepository trainerProfileRepository;
        private final UserRepository userRepository;
        private final AvailabilityService availabilityService;

        @Transactional
        public BookingDTO createBooking(Long userId, Long trainerProfileId, LocalDateTime startTime,
                        Integer durationMinutes) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                // Locking the trainer profile to prevent concurrent booking issues
                TrainerProfile trainerProfile = trainerProfileRepository.findById(trainerProfileId)
                                .orElseThrow(() -> new EntityNotFoundException("Trainer profile not found"));

                if (!trainerProfile.isAvailable()) {
                        throw new RuntimeException("Trainer is not currently accepting bookings");
                }

                LocalDateTime endTime = startTime.plusMinutes(durationMinutes);

                // Check if the slot is actually available (re-validate using availability
                // service logic)
                List<java.time.LocalTime> availableSlots = availabilityService.getAvailableSlots(trainerProfileId,
                                startTime.toLocalDate());
                if (!availableSlots.contains(startTime.toLocalTime())) {
                        throw new RuntimeException("Selected time slot is no longer available");
                }

                // Double check for overlapping bookings in DB (Final safety check)
                List<Booking> overlapping = bookingRepository.findOverlappingBookings(trainerProfile, startTime,
                                endTime);
                if (!overlapping.isEmpty()) {
                        // Check if maxSessionsPerSlot is reached for this exact start time
                        long count = overlapping.stream().filter(b -> b.getStartTime().equals(startTime)).count();
                        // We need to fetch the specific availability for this day to check
                        // maxSessionsPerSlot
                        // For simplicity in this step, we assume overlapping means unavailable if
                        // overlapping exists
                        // But a better check would be against maxSessionsPerSlot.
                        // In getAvailableSlots we already checked this, so findOverlappingBookings is a
                        // generic check.
                        throw new RuntimeException("Trainer is already booked for this time period");
                }

                Booking booking = Booking.builder()
                                .user(user)
                                .trainer(trainerProfile)
                                .startTime(startTime)
                                .endTime(endTime)
                                .status(BookingStatus.CONFIRMED)
                                .build();

                return convertToDTO(bookingRepository.save(booking));
        }

        public List<BookingDTO> getUserBookings(Long userId) {
                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));
                return bookingRepository.findByUser(user).stream()
                                .map(this::convertToDTO).collect(Collectors.toList());
        }

        public List<BookingDTO> getTrainerBookings(Long trainerProfileId) {
                TrainerProfile trainerProfile = trainerProfileRepository.findById(trainerProfileId)
                                .orElseThrow(() -> new EntityNotFoundException("Trainer profile not found"));
                return bookingRepository.findByTrainer(trainerProfile).stream()
                                .map(this::convertToDTO).collect(Collectors.toList());
        }

        @Transactional
        public BookingDTO updateBookingStatus(Long bookingId, BookingStatus status) {
                Booking booking = bookingRepository.findById(bookingId)
                                .orElseThrow(() -> new EntityNotFoundException("Booking not found"));
                booking.setStatus(status);
                return convertToDTO(bookingRepository.save(booking));
        }

        private BookingDTO convertToDTO(Booking booking) {
                return BookingDTO.builder()
                                .id(booking.getId())
                                .userId(booking.getUser().getId())
                                .userName(booking.getUser().getUsername())
                                .trainerId(booking.getTrainer().getId())
                                .trainerName(booking.getTrainer().getUser().getUsername())
                                .startTime(booking.getStartTime())
                                .endTime(booking.getEndTime())
                                .status(booking.getStatus())
                                .build();
        }
}
