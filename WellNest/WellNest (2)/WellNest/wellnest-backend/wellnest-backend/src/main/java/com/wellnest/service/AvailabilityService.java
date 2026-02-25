package com.wellnest.service;

import com.wellnest.dto.AvailabilityDTO;
import com.wellnest.entity.Availability;
import com.wellnest.entity.Booking;
import com.wellnest.entity.BookingStatus;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.repository.AvailabilityRepository;
import com.wellnest.repository.BookingRepository;
import com.wellnest.repository.TrainerProfileRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AvailabilityService {

        private final AvailabilityRepository availabilityRepository;
        private final TrainerProfileRepository trainerProfileRepository;
        private final BookingRepository bookingRepository;

        @Transactional
        public List<AvailabilityDTO> saveAvailabilities(Long trainerProfileId, List<AvailabilityDTO> dtos) {
                TrainerProfile trainerProfile = trainerProfileRepository.findById(trainerProfileId)
                                .orElseThrow(() -> new EntityNotFoundException("Trainer profile not found"));

                // Delete existing availabilities for this trainer
                List<Availability> existing = availabilityRepository.findByTrainerProfile(trainerProfile);
                availabilityRepository.deleteAll(existing);

                List<Availability> newAvailabilities = dtos.stream().map(dto -> Availability.builder()
                                .trainerProfile(trainerProfile)
                                .dayOfWeek(dto.getDayOfWeek())
                                .startTime(dto.getStartTime())
                                .endTime(dto.getEndTime())
                                .sessionDurationMinutes(dto.getSessionDurationMinutes())
                                .maxSessionsPerSlot(
                                                dto.getMaxSessionsPerSlot() != null ? dto.getMaxSessionsPerSlot() : 1)
                                .build()).collect(Collectors.toList());

                return availabilityRepository.saveAll(newAvailabilities).stream()
                                .map(this::convertToDTO).collect(Collectors.toList());
        }

        public List<AvailabilityDTO> getTrainerAvailabilities(Long trainerProfileId) {
                TrainerProfile trainerProfile = trainerProfileRepository.findById(trainerProfileId)
                                .orElseThrow(() -> new EntityNotFoundException("Trainer profile not found"));
                return availabilityRepository.findByTrainerProfile(trainerProfile).stream()
                                .map(this::convertToDTO).collect(Collectors.toList());
        }

        public List<LocalTime> getAvailableSlots(Long trainerProfileId, LocalDate date) {
                TrainerProfile trainerProfile = trainerProfileRepository.findById(trainerProfileId)
                                .orElseThrow(() -> new EntityNotFoundException("Trainer profile not found"));

                if (!trainerProfile.isAvailable()) {
                        return new ArrayList<>();
                }

                List<Availability> dailyAvailabilities = availabilityRepository.findByTrainerProfileAndDayOfWeek(
                                trainerProfile,
                                date.getDayOfWeek());
                List<Booking> bookings = bookingRepository.findByTrainerAndStartTimeAfterAndStatusNot(
                                trainerProfile, date.atStartOfDay(), BookingStatus.CANCELLED)
                                .stream()
                                .filter(b -> b.getStartTime().toLocalDate().equals(date))
                                .collect(Collectors.toList());

                List<LocalTime> availableSlots = new ArrayList<>();

                for (Availability availability : dailyAvailabilities) {
                        LocalTime current = availability.getStartTime();
                        while (current.plusMinutes(availability.getSessionDurationMinutes())
                                        .isBefore(availability.getEndTime()) ||
                                        current.plusMinutes(availability.getSessionDurationMinutes())
                                                        .equals(availability.getEndTime())) {

                                final LocalTime slotTime = current;
                                long bookedCount = bookings.stream()
                                                .filter(b -> b.getStartTime().toLocalTime().equals(slotTime))
                                                .count();

                                if (bookedCount < availability.getMaxSessionsPerSlot()) {
                                        // Also check if slot is in the past for today
                                        if (!date.equals(LocalDate.now()) || slotTime.isAfter(LocalTime.now())) {
                                                availableSlots.add(slotTime);
                                        }
                                }
                                current = current.plusMinutes(availability.getSessionDurationMinutes());
                        }
                }

                return availableSlots;
        }

        private AvailabilityDTO convertToDTO(Availability availability) {
                return AvailabilityDTO.builder()
                                .id(availability.getId())
                                .dayOfWeek(availability.getDayOfWeek())
                                .startTime(availability.getStartTime())
                                .endTime(availability.getEndTime())
                                .sessionDurationMinutes(availability.getSessionDurationMinutes())
                                .maxSessionsPerSlot(availability.getMaxSessionsPerSlot())
                                .build();
        }
}
