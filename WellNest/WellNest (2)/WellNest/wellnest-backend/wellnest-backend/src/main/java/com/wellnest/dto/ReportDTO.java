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
public class ReportDTO {
    private Long id;
    private Long blogPostId;
    private String blogPostTitle;
    private String reason;
    private String reportedByName;
    private boolean resolved;
    private LocalDateTime createdAt;
}
