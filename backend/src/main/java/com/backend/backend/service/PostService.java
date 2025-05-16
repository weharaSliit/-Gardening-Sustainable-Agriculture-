package com.backend.backend.service;

import com.backend.backend.dto.CommentResponseDTO;
import com.backend.backend.dto.CommunityPostResponseDTO;
import com.backend.backend.entity.Comment;
import com.backend.backend.entity.CommunityPost;
import com.backend.backend.entity.ProfileEntity;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.exception.ResourceNotFoundException;
import com.backend.backend.repository.CommentRepository;
import com.backend.backend.repository.PostRepository;
import com.backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PostService {

    @Autowired
    private CommentService commentService;

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository){
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public CommunityPostResponseDTO createPost(CommunityPost post){
        //validate the userId
        UserEntity user = userRepository.findById(post.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + post.getUserId()));

        post.setCreatedAt(LocalDateTime.now());
        post.setDeleted(false);
        post.setReactions(new HashMap<>());
        post.setShareCount(0); //new
        post.setComments(new ArrayList<>()); //new

        CommunityPost savedPost = postRepository.save(post);
        return mapToDTO(savedPost);
    }

    public List<CommunityPostResponseDTO> getAllPosts() {
        return postRepository.findAll().stream()
                .filter(post -> !post.isDeleted())
                .sorted(Comparator
                        .comparing(CommunityPost::isVerifiedPoster).reversed()
                        .thenComparing(CommunityPost::getCreatedAt).reversed())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    //new - 06.05.2025 - filtered and sorted post retrieval
    public List<CommunityPostResponseDTO> getFilteredAndSortedPosts(String userId, Boolean verified) {
        return postRepository.findAll().stream()
                .filter(post -> !post.isDeleted())
                .filter(post -> userId == null || post.getUserId().equals(userId))
                .filter(post -> verified == null || post.isVerifiedPoster() == verified)
                .sorted(Comparator
                        .comparing(CommunityPost::isVerifiedPoster).reversed()
                        .thenComparing(CommunityPost::getCreatedAt).reversed())
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public CommunityPostResponseDTO getPostById(String id){
        CommunityPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToDTO(post);
    }

    public CommunityPostResponseDTO updatePost(String id, CommunityPost updatedPost){
        CommunityPost existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        existing.setTitle(updatedPost.getTitle());
        existing.setContent(updatedPost.getContent());
        existing.setImageUrl(updatedPost.getImageUrl());
        return mapToDTO(postRepository.save(existing));
    }


    public CommunityPostResponseDTO partialUpdate(String id, CommunityPost patch) {
        CommunityPost existing = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        if (patch.getTitle() != null) existing.setTitle(patch.getTitle());
        if (patch.getContent() != null) existing.setContent(patch.getContent());
        if (patch.getImageUrl() != null) existing.setImageUrl(patch.getImageUrl());
        return mapToDTO(postRepository.save(existing));
    }
    //postId change to id
    public void deletePost(String id) {
        CommunityPost post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setDeleted(true);
        postRepository.save(post);
    }

    //new - 06.05.2025
    public CommunityPostResponseDTO addReaction(String postId, String userId, String reactionType){
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        post.getReactions().putIfAbsent(reactionType, new HashSet<>());
        Set<String> users = post.getReactions().get(reactionType);

        if(users.contains(userId)){
            users.remove(userId); //toggle off
        } else {
            users.add(userId);
        }

        postRepository.save(post);
        return mapToDTO(post);
    }

    public CommunityPostResponseDTO sharePost(String postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setShareCount(post.getShareCount() + 1);
        postRepository.save(post);
        return mapToDTO(post);
    }

    public String applyForVerification(String userId) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getProfile() != null) {
            user.getProfile().setStatus(false); // pending verification
            userRepository.save(user);
            return "Verification application submitted!";
        } else {
            return "Profile not found for user.";
        }
    }

    //new - 06.05.2025 = Add a comment for a post
    public CommunityPostResponseDTO addComment(String postId, String content) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if(authentication == null || !authentication.isAuthenticated()){
            throw new RuntimeException("Unauthorized.No valid authentication found");
        }
        String username = authentication.getPrincipal() instanceof UserDetails
                ? ((UserDetails) authentication.getPrincipal()).getUsername()
                : authentication.getPrincipal().toString();
        //Object principal = authentication.getPrincipal();
/*
        String username;
        if (principal instanceof UserDetails){
            username = ((UserDetails) principal).getUsername();
        }else {
            username = principal.toString();
        }*/

        //Fetch user entity and post entity
        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        //create and save comment
        Comment comment = new Comment(post, user, content);
        commentRepository.save(comment);

        post.getComments().add(comment);
        postRepository.save(post);

        return mapToDTO(post);
    }
    //new - 15/may/2025
    public Comment reactToComment(String commentId, String userId, String type){
        return commentService.reactToComment(commentId, userId, type);
    }


    // Get all comments for a post (returning just content for now)
    public List<CommentResponseDTO> getCommentsByPostId(String postId) {
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        /*
        return post.getComments().stream().map(comment -> {
            Optional<UserEntity> userOpt = userRepository.findById(comment.getUser().getId());
            String name = userOpt.map(UserEntity::getName).orElse("Unknown");
            String imageUrl = userOpt.flatMap(u -> Optional.ofNullable(u.getProfile()))
                    .map(ProfileEntity::getImage)
                    .orElse(null);
        */
        return post.getComments().stream().map(comment -> {
            UserEntity user = comment.getUser();
            ProfileEntity profile = user.getProfile();

            return new CommentResponseDTO(
                    comment.getContent(),
                    user.getId(),
                    user.getName(),
                    profile != null ? profile.getImage() : null,
                    comment.getCreatedAt()
            );
        }).collect(Collectors.toList());
    }

    //get full reactions with counts
    public Map<String, Integer> getReactionCounts(String postId){
        CommunityPost communityPost = postRepository.findById(postId)
                .orElseThrow(()->new ResourceNotFoundException("Post not found"));

        Map<String, Integer> counts = new HashMap<>();
        communityPost.getReactions().forEach((reactionType, users) -> counts.put(reactionType, users.size()));
        return counts;
    }

    public int getCommentCount(String postId){
        CommunityPost communityPost = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return communityPost.getComments().size();
    }

    //search bar
    public List<CommunityPost> searchPosts(String keyword) {
        List<CommunityPost> allPosts = postRepository.findByIsDeletedFalse();
        return allPosts.stream()
                .filter(post -> post.getTitle().toLowerCase().contains(keyword.toLowerCase())
                        || post.getContent().toLowerCase().contains(keyword.toLowerCase()))
                .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                .collect(Collectors.toList());
    }


    //DTO Mapper method
    private CommunityPostResponseDTO mapToDTO(CommunityPost post) {
        List<String> commentContents = post.getComments() != null
                ? post.getComments().stream().map(Comment::getContent).collect(Collectors.toList())
                : new ArrayList<>();

        return new CommunityPostResponseDTO(
                post.getId(),
                post.getUserId(),
                post.getTitle(),
                post.getContent(),
                post.getImageUrl(),
                post.isVerifiedPoster(),
                post.getCreatedAt(),
                post.getReactions(),
                post.getShareCount(),
                commentContents
        );
    }




}
