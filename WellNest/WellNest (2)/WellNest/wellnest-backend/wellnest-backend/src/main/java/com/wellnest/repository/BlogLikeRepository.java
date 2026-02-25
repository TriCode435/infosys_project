package com.wellnest.repository;

import com.wellnest.entity.BlogLike;
import com.wellnest.entity.BlogPost;
import com.wellnest.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface BlogLikeRepository extends JpaRepository<BlogLike, Long> {
    Optional<BlogLike> findByUserAndBlogPost(User user, BlogPost blogPost);

    boolean existsByUserAndBlogPost(User user, BlogPost blogPost);

    long countByBlogPost(BlogPost blogPost);
}
