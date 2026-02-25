package com.wellnest.dto;

import com.wellnest.entity.BlogStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BlogResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private Long authorId;
    private String authorRole;
    private String authorProfileImage;
    private CategoryDTO category;
    private List<String> tags;
    private List<String> imageUrls;
    private BlogStatus status;
    private Integer viewCount;
    private Integer likeCount;
    private Integer commentCount;
    private List<CommentDTO> comments;
    private boolean isLikedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
