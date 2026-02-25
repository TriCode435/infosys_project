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
public class BlogRequestDTO {
    private String title;
    private String content;
    private Long categoryId;
    private List<String> tags;
    private List<String> imageUrls;
}
