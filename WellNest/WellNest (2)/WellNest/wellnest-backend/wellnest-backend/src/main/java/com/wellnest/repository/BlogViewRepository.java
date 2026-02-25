package com.wellnest.repository;

import com.wellnest.entity.BlogView;
import com.wellnest.entity.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogViewRepository extends JpaRepository<BlogView, Long> {
    long countByBlogPost(BlogPost blogPost);
}
