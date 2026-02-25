package com.wellnest.controller;

import com.wellnest.entity.PostStatus;
import com.wellnest.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlogController {

    @Autowired
    private BlogService blogService;

    // 1. User Feed: Shows only approved posts
    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(blogService.getAllPosts());
    }

    // 2. Moderation Panel: Admin/Trainer review pending content
    @GetMapping("/pending")
    // Use hasAuthority to match the exact "ROLE_" string from your AuthTokenFilter
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TRAINER')")
    public ResponseEntity<?> getPendingPosts() {
        return ResponseEntity.ok(blogService.getPendingPosts());
    }

    // 3. Post Submission: Status automatically PENDING
    @PostMapping
    // CHANGED: Use hasAuthority instead of hasRole to avoid double "ROLE_" prefix
    @PreAuthorize("hasAuthority('ROLE_USER') or hasAuthority('ROLE_TRAINER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> createPost(@RequestBody Map<String, String> body,
                                       Authentication authentication) {
        
        // Safety Check: Ensure user is actually logged in
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Authentication required");
        }

        String title = body.get("title");
        String content = body.get("content");
        
        // Basic Validation
        if (title == null || content == null || title.isEmpty() || content.isEmpty()) {
            return ResponseEntity.badRequest().body("Title and Content are required");
        }

        return ResponseEntity.ok(blogService.createPost(authentication.getName(), title, content));
    }

    // 4. Content Approval
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_TRAINER')")
    public ResponseEntity<?> updatePostStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String status = body.get("status"); 
        return ResponseEntity.ok(blogService.updatePostStatus(id, status));
    }

    // 5. Like Feature
    @PatchMapping("/{id}/like")
    public ResponseEntity<?> likePost(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.likePost(id));
    }

    // 6. Comment Submission
    @PostMapping("/{id}/comment")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addComment(@PathVariable Long id, 
                                       @RequestBody Map<String, String> body, 
                                       Authentication auth) {
        String content = body.get("content");
        return ResponseEntity.ok(blogService.addComment(id, auth.getName(), content));
    }

    // 7. View Comments
    @GetMapping("/{id}/comments")
    public ResponseEntity<?> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getApprovedComments(id));
    }
}