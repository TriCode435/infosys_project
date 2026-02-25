package com.wellnest.repository;

import com.wellnest.entity.BlogPost;
import com.wellnest.entity.BlogStatus;
import com.wellnest.entity.User;
import com.wellnest.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {

        Page<BlogPost> findByStatus(BlogStatus status, Pageable pageable);

        Page<BlogPost> findByAuthorAndStatusNot(User author, BlogStatus status, Pageable pageable);

        Page<BlogPost> findByStatusAndCategory_Id(BlogStatus status, Long categoryId, Pageable pageable);

        Page<BlogPost> findByStatusAndAuthor_Role(BlogStatus status, Role role, Pageable pageable);

        Page<BlogPost> findByStatusAndCategory_IdAndAuthor_Role(BlogStatus status, Long categoryId, Role role,
                        Pageable pageable);

        long countByStatus(BlogStatus status);

        @Query("SELECT b FROM BlogPost b WHERE b.status = :status AND " +
                        "(LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        "LOWER(b.author.username) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
                        ":search MEMBER OF b.tags)")
        Page<BlogPost> searchPosts(@Param("status") BlogStatus status, @Param("search") String search,
                        Pageable pageable);

        @Query("SELECT b FROM BlogPost b WHERE b.status = :status ORDER BY SIZE(b.likes) DESC")
        Page<BlogPost> findMostLiked(@Param("status") BlogStatus status, Pageable pageable);

        @Query("SELECT b FROM BlogPost b WHERE b.status = :status ORDER BY SIZE(b.comments) DESC")
        Page<BlogPost> findMostCommented(@Param("status") BlogStatus status, Pageable pageable);

        long countByAuthor(User author);

        @Query("SELECT SUM(SIZE(b.likes)) FROM BlogPost b WHERE b.author = :author")
        Long countTotalLikesByAuthor(@Param("author") User author);

        @Query("SELECT SUM(SIZE(b.comments)) FROM BlogPost b WHERE b.author = :author")
        Long countTotalCommentsByAuthor(@Param("author") User author);

        @Query("SELECT b FROM BlogPost b WHERE b.author = :author AND b.status = :status ORDER BY SIZE(b.likes) DESC, SIZE(b.comments) DESC")
        List<BlogPost> findTopPerformingByAuthor(@Param("author") User author, @Param("status") BlogStatus status,
                        Pageable pageable);
}
