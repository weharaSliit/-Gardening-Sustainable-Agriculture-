package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "comments")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class Comment {

    @Id
    private String id;

    private String content;

    private LocalDateTime createdAt;

    private boolean isDeleted = false;

    @DBRef
    @JsonIgnoreProperties({"profile", "password"})
    private UserEntity user;

    @DBRef
    @JsonIgnoreProperties({"comments"})
    private CommunityPost post;

    @DBRef
    @JsonIgnoreProperties("parentComment")
    private List<CommentReply> replies = new ArrayList<>();

    private Map<String ,Set<String>> reactions = new HashMap<>();

    public Comment() {
        this.createdAt = LocalDateTime.now();
        this.reactions = new HashMap<>();
    }

    public Comment(CommunityPost post, UserEntity user, String content){
        this.post = post;
        this.user = user;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.reactions = new HashMap<>();
    }

    public List<CommentReply> getReplies() {return replies;}
    public void setReplies(List<CommentReply> replies) {this.replies = replies;}

    // Getters and Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public CommunityPost getPost() {
        return post;
    }

    public void setPost(CommunityPost post) {
        this.post = post;
    }

    public Map<String, Set<String>> getReactions() { return reactions; }

    public void setReactions(Map<String, Set<String>> reactions) { this.reactions = reactions; }
}
