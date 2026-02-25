package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "trainer_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ElementCollection
    @CollectionTable(name = "trainer_specializations", joinColumns = @JoinColumn(name = "trainer_id"))
    @Column(name = "specialization")
    @Builder.Default
    private List<String> specializations = new ArrayList<>();

    private Integer availableHoursPerDay;
    private Integer experienceYears;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Double pricePerSession;
    private String profileImage;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "is_available", columnDefinition = "boolean default true")
    private boolean isAvailable = true;

    // Temporary column mapping to satisfy the mistakenly generated 'available'
    // column
    @Builder.Default
    @Column(name = "available", columnDefinition = "boolean default true")
    private boolean availableCol = true;

    @Builder.Default
    private Double averageRating = 0.0;

    @OneToMany(mappedBy = "trainerProfile", cascade = CascadeType.ALL)
    private java.util.List<Availability> availabilities;
}
