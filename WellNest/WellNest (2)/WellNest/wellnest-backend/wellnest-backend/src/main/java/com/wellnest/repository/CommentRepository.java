package com.wellnest.repository;

import com.wellnest.entity.Comment;
import com.wellnest.entity.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByBlogPost(BlogPost blogPost, Pageable pageable);
}
