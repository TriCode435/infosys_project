package com.wellnest.service;

import com.wellnest.entity.BlogPost;
import com.wellnest.entity.Comment; // Comment entity import panniko
import com.wellnest.entity.PostStatus; 
import com.wellnest.entity.User;
import com.wellnest.repository.BlogPostRepository;
import com.wellnest.repository.CommentRepository; // Repo create panni import pannu
import com.wellnest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class BlogService {

    @Autowired
    private BlogPostRepository blogPostRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CommentRepository commentRepository;

    // User Dashboard-kku Approved posts mattum fetch pannum
    public List<BlogPost> getAllPosts() {
        return blogPostRepository.findByStatus(PostStatus.APPROVED);
    }

    // Admin/Moderation Panel-kku Pending posts fetch panna
    public List<BlogPost> getPendingPosts() {
        return blogPostRepository.findByStatus(PostStatus.PENDING);
    }

    public BlogPost createPost(String username, String title, String content) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BlogPost post = BlogPost.builder()
                .title(title)
                .content(content)
                .author(author)
                .status(PostStatus.PENDING) // Default status for moderation
                .likesCount(0) // Initial likes
                .createdAt(LocalDateTime.now())
                .build();

        return blogPostRepository.save(post);
    }

    public BlogPost updatePostStatus(Long postId, String statusStr) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        
        post.setStatus(PostStatus.valueOf(statusStr.toUpperCase()));
        return blogPostRepository.save(post);
    }

    // --- NEW ENGAGEMENT FEATURES ---

    // Like logic (Screenshot requirement 3)
    public BlogPost likePost(Long postId) {
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setLikesCount(post.getLikesCount() + 1);
        return blogPostRepository.save(post);
    }

    // Comment logic with moderation workflow
    public Comment addComment(Long postId, String username, String content) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        BlogPost post = blogPostRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = Comment.builder()
                .content(content)
                .author(author)
                .post(post)
                .status(PostStatus.PENDING) // Comment moderation requirement
                .createdAt(LocalDateTime.now())
                .build();
        
        return commentRepository.save(comment);
    }

    // Approved comments mattum oru post-kku fetch panna
    public List<Comment> getApprovedComments(Long postId) {
        return commentRepository.findByPostIdAndStatus(postId, PostStatus.APPROVED);
    }
}