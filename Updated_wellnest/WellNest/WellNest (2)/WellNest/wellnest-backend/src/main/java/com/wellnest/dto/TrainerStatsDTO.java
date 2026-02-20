package com.wellnest.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerStatsDTO {
    private int activeClients;
    private long totalAssignments;
    private double completionRate;
}
