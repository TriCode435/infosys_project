package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "sleep_mood", uniqueConstraints = {
        @UniqueConstraint(columnNames = { "profile_id", "date" })
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SleepMood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "profile_id", nullable = false)
    private UserProfile profile;

    @Column(columnDefinition = "DOUBLE PRECISION")
    private Double sleepHours;
    private String mood;
    private Integer stressLevel;
    private LocalDate date;
}
