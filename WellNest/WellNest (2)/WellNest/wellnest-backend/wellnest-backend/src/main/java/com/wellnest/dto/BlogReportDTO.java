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
public class BlogReportDTO {
    private Long id;
    private String reason;
    private String reportedBy;
    private Long blogPostId;
    private String blogPostTitle;
    private String blogPostAuthor;
    private boolean resolved;
    private LocalDateTime createdAt;
}
