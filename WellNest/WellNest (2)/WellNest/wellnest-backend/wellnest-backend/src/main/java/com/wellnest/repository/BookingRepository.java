package com.wellnest.repository;

import com.wellnest.entity.Booking;
import com.wellnest.entity.BookingStatus;
import com.wellnest.entity.TrainerProfile;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
        List<Booking> findByUser(User user);

        List<Booking> findByTrainer(TrainerProfile trainer);

        @Query("SELECT b FROM Booking b WHERE b.trainer = :trainer AND " +
                        "((b.startTime < :endTime AND b.endTime > :startTime)) AND " +
                        "b.status != 'CANCELLED'")
        List<Booking> findOverlappingBookings(@Param("trainer") TrainerProfile trainer,
                        @Param("startTime") LocalDateTime startTime,
                        @Param("endTime") LocalDateTime endTime);

        List<Booking> findByTrainerAndStartTimeAfterAndStatusNot(TrainerProfile trainer, LocalDateTime startTime,
                        BookingStatus status);

        boolean existsByTrainerAndUser(TrainerProfile trainer, User user);
}
