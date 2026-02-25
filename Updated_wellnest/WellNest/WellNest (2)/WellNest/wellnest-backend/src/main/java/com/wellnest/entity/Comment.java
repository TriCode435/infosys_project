package com.wellnest.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private BlogPost post;

    @ManyToOne
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.PENDING; // Comment moderation requirement

    private LocalDateTime createdAt;
}