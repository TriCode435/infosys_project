package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackDTO {
    private Long id;
    private Long bookingId;
    private Long userId;
    private String userName;
    private Long trainerId;
    private String trainerName;
    private Integer rating;
    private String reviewText;
    private LocalDateTime createdAt;
}
