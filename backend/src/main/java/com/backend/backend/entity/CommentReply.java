package com.backend.backend.entity;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Document(collection = "comment_replies")
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
public class CommentReply {

    @Id
    private String id;

    private String content;

    private LocalDateTime createdAt;

    private boolean isDeleted = false;

    @DBRef
    @JsonIgnoreProperties({"profile", "password"})
    private UserEntity user;

    @DBRef
    @JsonIgnoreProperties({"replies"})
    private Comment parentComment;

    private Map<String, Set<String>> reactions = new HashMap<>();

    public CommentReply() {
        this.createdAt = LocalDateTime.now();
        this.reactions = new HashMap<>();
    }

    public CommentReply(Comment parentComment, UserEntity user, String content) {
        this.parentComment = parentComment;
        this.user = user;
        this.content = content;
        this.createdAt = LocalDateTime.now();
        this.reactions = new HashMap<>();
    }

    // Getters and Setters

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public UserEntity getUser() { return user; }
    public void setUser(UserEntity user) { this.user = user; }

    public Comment getParentComment() { return parentComment; }
    public void setParentComment(Comment parentComment) { this.parentComment = parentComment; }

    public Map<String, Set<String>> getReactions() { return reactions; }
    public void setReactions(Map<String, Set<String>> reactions) { this.reactions = reactions; }
}

