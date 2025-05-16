package com.backend.backend.dto;

import java.time.LocalDateTime;

public class CommentResponseDTO {
    private String content;
    private String userId;
    private String userName;
    private String userImageUrl;
    private LocalDateTime createdAt;

    public CommentResponseDTO() {
    }

    public CommentResponseDTO(String content, String userId, String userName, String userImageUrl, LocalDateTime createdAt) {
        this.content = content;
        this.userId = userId;
        this.userName = userName;
        this.userImageUrl = userImageUrl;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserImageUrl() {
        return userImageUrl;
    }

    public void setUserImageUrl(String userImageUrl) {
        this.userImageUrl = userImageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

