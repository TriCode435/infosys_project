package com.wellnest.repository;

import com.wellnest.entity.Comment;
import com.wellnest.entity.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Oru specific post-kku approved comments mattum fetch panna
    List<Comment> findByPostIdAndStatus(Long postId, PostStatus status);

    // Admin/Trainer moderation panel-kku pending comments fetch panna
    List<Comment> findByStatus(PostStatus status);
}