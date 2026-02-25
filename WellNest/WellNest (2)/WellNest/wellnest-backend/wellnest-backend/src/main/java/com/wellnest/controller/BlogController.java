package com.wellnest.controller;

import java.util.List;
import com.wellnest.dto.*;
import com.wellnest.entity.BlogStatus;
import com.wellnest.service.BlogService;
import com.wellnest.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/blog")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BlogController {

    @Autowired
    private BlogService blogService;

    @Autowired
    private FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Page<BlogResponseDTO>> getAllPosts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "false") boolean trending,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort;
        if (trending) {
            sort = Sort.unsorted(); // Sorting handled by custom logic or different query
        } else {
            sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(blogService.getFilteredPosts(categoryId, role, trending, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BlogResponseDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.getPostById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('USER', 'TRAINER')")
    public ResponseEntity<BlogResponseDTO> createPost(@RequestBody BlogRequestDTO request,
            Authentication authentication) {
        return ResponseEntity.ok(blogService.createPost(authentication.getName(), request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'TRAINER')")
    public ResponseEntity<BlogResponseDTO> updatePost(@PathVariable Long id,
            @RequestBody BlogRequestDTO request,
            Authentication authentication) {
        return ResponseEntity.ok(blogService.updatePost(id, authentication.getName(), request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'TRAINER', 'ADMIN')")
    public ResponseEntity<?> deletePost(@PathVariable Long id,
            Authentication authentication) {
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        blogService.deletePost(id, authentication.getName(), isAdmin);
        return ResponseEntity.ok(Map.of("message", "Post deleted successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<BlogResponseDTO>> searchPosts(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(blogService.searchPosts(query, pageable));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<?> toggleLike(@PathVariable Long id, Authentication authentication) {
        blogService.toggleLike(id, authentication.getName());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/comment")
    public ResponseEntity<CommentDTO> addComment(@PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        return ResponseEntity.ok(blogService.addComment(id, authentication.getName(), body.get("content")));
    }

    @PostMapping("/{id}/report")
    public ResponseEntity<?> reportPost(@PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication) {
        blogService.reportPost(id, authentication.getName(), body.get("reason"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        String fileUrl = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Map.of("url", fileUrl));
    }

    @GetMapping("/analytics")
    public ResponseEntity<BlogAnalyticsDTO> getMyAnalytics(Authentication authentication) {
        return ResponseEntity.ok(blogService.getAuthorAnalytics(authentication.getName()));
    }

    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDTO>> getCategories() {
        return ResponseEntity.ok(blogService.getCategories());
    }

    // Admin Endpoints
    @PutMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approvePost(@PathVariable Long id) {
        blogService.moderatePost(id, BlogStatus.APPROVED);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectPost(@PathVariable Long id) {
        blogService.moderatePost(id, BlogStatus.REJECTED);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<BlogResponseDTO>> getPendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(blogService.getPendingPosts(pageable));
    }

    @GetMapping("/admin/reported")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BlogReportDTO>> getReportedPosts() {
        return ResponseEntity.ok(blogService.getReportedPosts());
    }

    @PutMapping("/admin/report/{id}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resolveReport(@PathVariable Long id) {
        blogService.resolveReport(id);
        return ResponseEntity.ok().build();
    }
}
