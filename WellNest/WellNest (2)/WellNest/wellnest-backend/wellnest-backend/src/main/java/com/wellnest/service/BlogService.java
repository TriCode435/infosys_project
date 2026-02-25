package com.wellnest.service;

import com.wellnest.dto.*;
import com.wellnest.dto.BlogReportDTO;
import com.wellnest.entity.*;
import com.wellnest.entity.Role;
import com.wellnest.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogService {

        @Autowired
        private BlogPostRepository blogPostRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private BlogLikeRepository blogLikeRepository;

        @Autowired
        private CommentRepository commentRepository;

        @Autowired
        private BlogReportRepository blogReportRepository;

        @Autowired
        private BlogViewRepository blogViewRepository;

        @Autowired
        private AIService aiService;

        @Transactional
        public BlogResponseDTO createPost(String username, BlogRequestDTO request) {
                if (aiService.isAbusive(request.getTitle()) || aiService.isAbusive(request.getContent())) {
                        throw new RuntimeException("Post contains inappropriate language");
                }

                User author = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                Category category = null;
                if (request.getCategoryId() != null) {
                        category = categoryRepository.findById(request.getCategoryId())
                                        .orElseThrow(() -> new RuntimeException("Category not found"));
                }

                BlogPost post = BlogPost.builder()
                                .title(request.getTitle())
                                .content(request.getContent())
                                .author(author)
                                .category(category)
                                .tags(request.getTags())
                                .status(BlogStatus.PENDING)
                                .build();

                if (request.getImageUrls() != null) {
                        List<BlogImage> images = request.getImageUrls().stream()
                                        .map(url -> BlogImage.builder().imageUrl(url).blogPost(post).build())
                                        .collect(Collectors.toList());
                        post.setImages(images);
                }

                return mapToDTO(blogPostRepository.save(post), author);
        }

        @Transactional
        public BlogResponseDTO updatePost(Long id, String username, BlogRequestDTO request) {
                BlogPost post = blogPostRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                if (!post.getAuthor().getUsername().equals(username)) {
                        throw new RuntimeException("You are not authorized to update this post");
                }

                post.setTitle(request.getTitle());
                post.setContent(request.getContent());
                post.setTags(request.getTags());
                post.setStatus(BlogStatus.PENDING); // Require re-approval after edits

                if (request.getCategoryId() != null) {
                        Category category = categoryRepository.findById(request.getCategoryId())
                                        .orElseThrow(() -> new RuntimeException("Category not found"));
                        post.setCategory(category);
                }

                // Logic for updating images can be added here (clear and re-add or partial
                // update)
                if (request.getImageUrls() != null) {
                        post.getImages().clear();
                        List<BlogImage> images = request.getImageUrls().stream()
                                        .map(url -> BlogImage.builder().imageUrl(url).blogPost(post).build())
                                        .collect(Collectors.toList());
                        post.getImages().addAll(images);
                }

                return mapToDTO(blogPostRepository.save(post), post.getAuthor());
        }

        @Transactional
        public void deletePost(Long id, String username, boolean isAdmin) {
                BlogPost post = blogPostRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                if (!isAdmin && !post.getAuthor().getUsername().equals(username)) {
                        throw new RuntimeException("You are not authorized to delete this post");
                }

                post.setStatus(BlogStatus.DELETED);
                blogPostRepository.save(post);
        }

        public Page<BlogResponseDTO> getFilteredPosts(Long categoryId, String role, boolean trending,
                        Pageable pageable) {
                User currentUser = getCurrentUser();
                Page<BlogPost> posts;

                if (trending) {
                        posts = blogPostRepository.findMostLiked(BlogStatus.APPROVED, pageable);
                } else if (categoryId != null && role != null) {
                        Role r = Role.valueOf(role.toUpperCase());
                        posts = blogPostRepository.findByStatusAndCategory_IdAndAuthor_Role(BlogStatus.APPROVED,
                                        categoryId, r, pageable);
                } else if (categoryId != null) {
                        posts = blogPostRepository.findByStatusAndCategory_Id(BlogStatus.APPROVED, categoryId,
                                        pageable);
                } else if (role != null) {
                        Role r = Role.valueOf(role.toUpperCase());
                        posts = blogPostRepository.findByStatusAndAuthor_Role(BlogStatus.APPROVED, r, pageable);
                } else {
                        posts = blogPostRepository.findByStatus(BlogStatus.APPROVED, pageable);
                }

                return posts.map(post -> mapToDTO(post, currentUser));
        }

        public Page<BlogResponseDTO> searchPosts(String query, Pageable pageable) {
                User currentUser = getCurrentUser();
                return blogPostRepository.searchPosts(BlogStatus.APPROVED, query, pageable)
                                .map(post -> mapToDTO(post, currentUser));
        }

        public BlogResponseDTO getPostById(Long id) {
                BlogPost post = blogPostRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                if (post.getStatus() == BlogStatus.DELETED) {
                        throw new RuntimeException("Post not found");
                }

                User currentUser = getCurrentUser();
                if (post.getStatus() != BlogStatus.APPROVED && (currentUser == null
                                || (!currentUser.getRole().name().equals("ADMIN")
                                                && !post.getAuthor().equals(currentUser)))) {
                        throw new RuntimeException("Access denied");
                }

                // Increment view count
                recordView(post, currentUser);

                return mapToDTO(post, currentUser);
        }

        private void recordView(BlogPost post, User user) {
                BlogView view = BlogView.builder()
                                .blogPost(post)
                                .user(user)
                                .viewedAt(LocalDateTime.now())
                                .build();
                blogViewRepository.save(view);
                post.setViewCount(post.getViewCount() + 1);
                blogPostRepository.save(post);
        }

        @Transactional
        public void toggleLike(Long postId, String username) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                BlogPost post = blogPostRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                blogLikeRepository.findByUserAndBlogPost(user, post).ifPresentOrElse(
                                blogLikeRepository::delete,
                                () -> blogLikeRepository.save(BlogLike.builder().user(user).blogPost(post).build()));
        }

        @Transactional
        public CommentDTO addComment(Long postId, String username, String content) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                BlogPost post = blogPostRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                Comment comment = Comment.builder()
                                .content(content)
                                .user(user)
                                .blogPost(post)
                                .build();

                return mapToCommentDTO(commentRepository.save(comment));
        }

        @Transactional
        public void reportPost(Long postId, String username, String reason) {
                User user = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));
                BlogPost post = blogPostRepository.findById(postId)
                                .orElseThrow(() -> new RuntimeException("Post not found"));

                BlogReport report = BlogReport.builder()
                                .reason(reason)
                                .reportedBy(user)
                                .blogPost(post)
                                .build();

                blogReportRepository.save(report);
        }

        @Transactional
        public void moderatePost(Long id, BlogStatus status) {
                BlogPost post = blogPostRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Post not found"));
                post.setStatus(status);
                blogPostRepository.save(post);
        }

        public BlogAnalyticsDTO getAuthorAnalytics(String username) {
                User author = userRepository.findByUsername(username)
                                .orElseThrow(() -> new RuntimeException("User not found"));

                long totalPosts = blogPostRepository.countByAuthor(author);
                Long totalLikes = blogPostRepository.countTotalLikesByAuthor(author);
                Long totalComments = blogPostRepository.countTotalCommentsByAuthor(author);

                // Find most popular post
                List<BlogPost> topPosts = blogPostRepository.findTopPerformingByAuthor(author, BlogStatus.APPROVED,
                                Pageable.ofSize(1));
                BlogResponseDTO mostPopular = topPosts.isEmpty() ? null : mapToDTO(topPosts.get(0), author);

                return BlogAnalyticsDTO.builder()
                                .totalPosts(totalPosts)
                                .totalLikes(totalLikes != null ? totalLikes : 0)
                                .totalComments(totalComments != null ? totalComments : 0)
                                .mostPopularPost(mostPopular)
                                .build();
        }

        public Page<BlogResponseDTO> getPendingPosts(Pageable pageable) {
                User currentUser = getCurrentUser();
                return blogPostRepository.findByStatus(BlogStatus.PENDING, pageable)
                                .map(post -> mapToDTO(post, currentUser));
        }

        public List<BlogReportDTO> getReportedPosts() {
                return blogReportRepository.findByResolvedFalse().stream()
                                .filter(report -> report.getBlogPost() != null
                                                && report.getBlogPost().getStatus() != BlogStatus.DELETED)
                                .map(report -> BlogReportDTO.builder()
                                                .id(report.getId())
                                                .reason(report.getReason())
                                                .reportedBy(report.getReportedBy().getUsername())
                                                .blogPostId(report.getBlogPost().getId())
                                                .blogPostTitle(report.getBlogPost().getTitle())
                                                .blogPostAuthor(report.getBlogPost().getAuthor().getUsername())
                                                .resolved(report.isResolved())
                                                .createdAt(report.getCreatedAt())
                                                .build())
                                .collect(Collectors.toList());
        }

        @Transactional
        public void resolveReport(Long reportId) {
                BlogReport report = blogReportRepository.findById(reportId)
                                .orElseThrow(() -> new RuntimeException("Report not found"));
                report.setResolved(true);
                blogReportRepository.save(report);
        }

        public List<CategoryDTO> getCategories() {
                if (categoryRepository.count() == 0) {
                        initializeCategories();
                }
                return categoryRepository.findAll().stream()
                                .map(this::mapCategoryToDTO)
                                .collect(Collectors.toList());
        }

        private void initializeCategories() {
                List<String> categories = List.of("Fitness", "Nutrition", "Wellness", "Mental Health",
                                "Transformation");
                for (String name : categories) {
                        Category cat = new Category();
                        cat.setName(name);
                        cat.setDescription(name + " related articles and tips.");
                        categoryRepository.save(cat);
                }
        }

        private User getCurrentUser() {
                Authentication auth = SecurityContextHolder.getContext().getAuthentication();
                if (auth == null || !auth.isAuthenticated() || auth.getPrincipal().equals("anonymousUser")) {
                        return null;
                }
                return userRepository.findByUsername(auth.getName()).orElse(null);
        }

        private BlogResponseDTO mapToDTO(BlogPost post, User currentUser) {
                String profileImage = null;
                if (post.getAuthor().getRole() == com.wellnest.entity.Role.TRAINER
                                && post.getAuthor().getTrainerProfile() != null) {
                        profileImage = post.getAuthor().getTrainerProfile().getProfileImage();
                }

                return BlogResponseDTO.builder()
                                .id(post.getId())
                                .title(post.getTitle())
                                .content(post.getContent())
                                .authorName(post.getAuthor().getUsername())
                                .authorId(post.getAuthor().getId())
                                .authorRole(post.getAuthor().getRole().name())
                                .authorProfileImage(profileImage)
                                .category(post.getCategory() != null ? mapCategoryToDTO(post.getCategory()) : null)
                                .tags(post.getTags())
                                .imageUrls(post.getImages() != null
                                                ? post.getImages().stream().map(BlogImage::getImageUrl)
                                                                .collect(Collectors.toList())
                                                : null)
                                .status(post.getStatus())
                                .viewCount(post.getViewCount())
                                .likeCount(post.getLikes() != null ? post.getLikes().size() : 0)
                                .commentCount(post.getComments() != null ? post.getComments().size() : 0)
                                .comments(post.getComments() != null ? post.getComments().stream()
                                                .map(this::mapToCommentDTO).collect(Collectors.toList()) : null)
                                .isLikedByCurrentUser(currentUser != null && post.getLikes() != null
                                                && post.getLikes().stream()
                                                                .anyMatch(l -> l.getUser() != null && l.getUser()
                                                                                .getId().equals(currentUser.getId())))
                                .createdAt(post.getCreatedAt())
                                .updatedAt(post.getUpdatedAt())
                                .build();
        }

        private CategoryDTO mapCategoryToDTO(Category category) {
                return CategoryDTO.builder()
                                .id(category.getId())
                                .name(category.getName())
                                .description(category.getDescription())
                                .build();
        }

        private CommentDTO mapToCommentDTO(Comment comment) {
                return CommentDTO.builder()
                                .id(comment.getId())
                                .blogPostId(comment.getBlogPost().getId())
                                .content(comment.getContent())
                                .authorName(comment.getUser().getUsername())
                                .authorId(comment.getUser().getId())
                                .createdAt(comment.getCreatedAt())
                                .updatedAt(comment.getUpdatedAt())
                                .build();
        }
}
