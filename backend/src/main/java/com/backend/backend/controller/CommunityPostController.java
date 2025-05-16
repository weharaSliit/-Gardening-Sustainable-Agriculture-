package com.backend.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend.dto.CommentResponseDTO;
import com.backend.backend.dto.CommunityPostResponseDTO;
import com.backend.backend.dto.ReplyRequest;
import com.backend.backend.entity.Comment;
import com.backend.backend.entity.CommentReply;
import com.backend.backend.entity.CommunityPost;
import com.backend.backend.service.CommentService;
import com.backend.backend.service.PostService;

@RestController
@RequestMapping("/community/posts")
public class CommunityPostController {


    private final PostService postService;
    private final CommentService commentService;

    public CommunityPostController(PostService postService, CommentService commentService){
        this.postService = postService;
        this.commentService = commentService;

    }

    //---------Posts-------------

    @PostMapping
    public ResponseEntity<CommunityPostResponseDTO> createPost(@RequestBody CommunityPost post){
        //CommunityPost created = postService.createPost(post);
        return ResponseEntity.ok(postService.createPost(post));
    }

    @GetMapping
    public ResponseEntity<List<CommunityPostResponseDTO>> getAllPosts(
            @RequestParam(required = false) String userId,
            @RequestParam(required = false) Boolean verified
    ){
        //return ResponseEntity.ok(postService.getAllPosts());
        return ResponseEntity.ok(postService.getFilteredAndSortedPosts(userId, verified));
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
    public ResponseEntity<CommunityPostResponseDTO> partialUpdate(
        @PathVariable String id, 
        @RequestBody CommunityPost partialUpdate){
        return ResponseEntity.ok(postService.partialUpdate(id, partialUpdate));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
            postService.deletePost(id);
            return ResponseEntity.noContent().build();
        }
    
    
        //new - 05.06.2025
    //-----------Reactions----------------
    @PostMapping("/{postId}/react")
    public ResponseEntity<CommunityPostResponseDTO> addReaction(
            @PathVariable String postId,
            @RequestParam String userId,
            @RequestParam String reactionType
    ){
        //postService.addReaction(postId, userId, reactionType);
        //return ResponseEntity.ok().build();
        CommunityPostResponseDTO updatedPost = postService.addReaction(postId, userId, reactionType);
        return ResponseEntity.ok(updatedPost);
    }

    //get reactions count on reaction bar
    @GetMapping("/reactions/{postId}/count")
    public ResponseEntity<Map<String, Integer>> getReactionsCount(@PathVariable String postId) {
        //dummy values to check
        /*
        Map<String, Integer> dummyCounts = new HashMap<>();
        dummyCounts.put("like",3);
        dummyCounts.put("heart",2);
        return ResponseEntity.ok(dummyCounts);
        */
        return ResponseEntity.ok(postService.getReactionCounts(postId));
    }

    //get comment count on reaction bar
    @GetMapping("/comments/{postId}/count")
    public ResponseEntity<Integer> getCommentCount(@PathVariable String postId) {
        return ResponseEntity.ok(postService.getCommentCount(postId));
    }


    //uses JWT
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommunityPostResponseDTO> addComment(
            @PathVariable String postId,
            @RequestBody Map<String,String> payload){

        String content = payload.get("text");

        CommunityPostResponseDTO dto = postService.addComment(postId, content);
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getComments(@PathVariable String postId){
        List<CommentResponseDTO> comments = postService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/comments/{commentId}/react")
    public Comment reactToComment(@PathVariable String commentId,
                                  @RequestParam String userId,
                                  @RequestParam String type){
        return postService.reactToComment(commentId,userId,type);
    }
    //------------Search bar----------
    @GetMapping("/search")
    public ResponseEntity<List<CommunityPost>> searchPosts(@RequestParam String keyword) {
        List<CommunityPost> results = postService.searchPosts(keyword);
        return ResponseEntity.ok(results);
    }

    //-----------Share----------------
    @PostMapping("/{postId}/share")
    public ResponseEntity<CommunityPostResponseDTO> sharePost(@PathVariable String postId){
        return ResponseEntity.ok(postService.sharePost(postId));
    }

    //-----------Verification----------------
    @PostMapping("/apply-verified")
    public ResponseEntity<String> applyForVerification(@RequestParam String userId){
        return ResponseEntity.ok(postService.applyForVerification(userId));
    }

    //delete a comment on a post - post owner only
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @RequestParam String userId) {
        commentService.deleteComment(postId, commentId, userId);
        return ResponseEntity.ok().body("Comment deleted successfully");
    }

    //reply to a comment on a post
    @PostMapping("/reply/{commentId}")
    public ResponseEntity<?> replyToComment(
            @PathVariable String commentId,
            @RequestBody ReplyRequest request) {
        CommentReply reply = commentService.replyToComment(commentId, request.getUserId(), request.getContent());
        return ResponseEntity.ok(reply);
    }





}
