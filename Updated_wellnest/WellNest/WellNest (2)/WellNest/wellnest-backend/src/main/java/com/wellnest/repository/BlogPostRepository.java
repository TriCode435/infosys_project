package com.wellnest.repository;

import com.wellnest.entity.BlogPost;
import com.wellnest.entity.PostStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    // Approved posts mattum user dashboard-ku fetch panna
    List<BlogPost> findByStatus(PostStatus status);
}