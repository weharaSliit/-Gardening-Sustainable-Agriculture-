package com.backend.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

public class CommunityPostResponseDTO {
    private String id;
    private String userId;
    private String title;
    private String content;
    private String imageUrl;
    private boolean verifiedPoster;
    private Map<String, Set<String>> reactions;
    private LocalDateTime createdAt;
    private int shareCount;
    private List<String> comments;
    //new
    private Map<String, Integer> reactionCounts;
    private int commentCount;

public CommunityPostResponseDTO(){}

public CommunityPostResponseDTO(
    String id,
    String userId,
    String title,
    String content,
    String imageUrl,
    boolean verifiedPoster,
    LocalDateTime createdAt,
    //boolean isDeleted,
    Map<String, Set<String>> reactions,
    int shareCount,
    List<String> comments
) {
    this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.verifiedPoster = verifiedPoster;
        this.reactions = reactions;
        this.createdAt = createdAt;
        this.shareCount = shareCount;
        this.comments = comments;
    }

    //getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean isVerifiedPoster() {
        return verifiedPoster;
    }

    public void setVerifiedPoster(boolean verifiedPoster) {
        this.verifiedPoster = verifiedPoster;
    }

    public Map<String, Set<String>> getReactions() {
        return reactions;
    }

    public void setReactions(Map<String, Set<String>> reactions) {
        this.reactions = reactions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public int getShareCount(){
        return shareCount;
    }

    public void setShareCount(int shareCount){
        this.shareCount = shareCount;
    }

    public List<String> getComments() { return comments; }
    public void setComments(List<String> comments) { this.comments = comments; }
}
