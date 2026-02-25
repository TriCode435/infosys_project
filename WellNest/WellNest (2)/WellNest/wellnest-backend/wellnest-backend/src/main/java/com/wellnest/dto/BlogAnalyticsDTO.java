package com.wellnest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogAnalyticsDTO {
    private long totalPosts;
    private long totalLikes;
    private long totalComments;
    private long totalViews;
    private BlogResponseDTO mostPopularPost;
    private List<BlogResponseDTO> recentPosts;
    private double engagementRate;
}
