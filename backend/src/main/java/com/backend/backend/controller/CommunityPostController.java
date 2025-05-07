package com.backend.backend.controller;

import com.backend.backend.dto.CommunityPostResponseDTO;
import com.backend.backend.entity.CommunityPost;
import com.backend.backend.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/posts")
public class CommunityPostController {

    private final PostService postService;

    public CommunityPostController(PostService postService){
        this.postService = postService;
    }

    @PostMapping
    public ResponseEntity<CommunityPostResponseDTO> createPost(@RequestBody CommunityPost post){
        //CommunityPost created = postService.createPost(post);
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping
    public ResponseEntity<List<CommunityPostResponseDTO>> getAllPosts(){
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommunityPostResponseDTO> getPostById(@PathVariable String id){
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommunityPostResponseDTO> updatePost(@PathVariable String id, @RequestBody CommunityPost updatePostData){
        return ResponseEntity.ok(postService.updatePost(id, updatePostData));
        //return ResponseEntity.ok(updatedPost);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<CommunityPostResponseDTO> partialUpdate(@PathVariable String id, @RequestBody CommunityPost partialUpdate){
        return ResponseEntity.ok(postService.partialUpdate(id, partialUpdate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        }
}
