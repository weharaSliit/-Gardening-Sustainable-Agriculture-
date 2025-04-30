package com.backend.backend.service;


import com.backend.backend.dto.CommunityPostResponseDTO;
import com.backend.backend.entity.CommunityPost;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.PostRepository;
import com.backend.backend.repository.UserRepository;
import org.apache.catalina.User;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PostService {

    private final PostRepository postRepository;

    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository){
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    public CommunityPostResponseDTO createPost(CommunityPost post){
        //validate the userId
        UserEntity user = userRepository.findById(post.getUserId())
                        .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + post.getUserId()));

        post.setCreatedAt(java.time.LocalDateTime.now());
        post.setDeleted(false);
        post.setReactions(new HashMap<>());
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

    //Mapper method
    private CommunityPostResponseDTO mapToDTO(CommunityPost post) {
        return new CommunityPostResponseDTO(
                post.getId(),
                post.getUserId(),
                post.getTitle(),
                post.getContent(),
                post.getImageUrl(),
                post.isVerifiedPoster(),
                post.getCreatedAt(),
                post.getReactions()
        );
    }




}
