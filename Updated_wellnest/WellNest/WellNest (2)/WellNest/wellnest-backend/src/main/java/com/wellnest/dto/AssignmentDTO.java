package com.wellnest.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDTO {
    private Long id;
    private Long trainerId;
    private String trainerUsername;
    private Long userId;
    private String userUsername;
    private LocalDate assignedDate;
}
