package com.backend.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.*;

@Document(collection = "community_post")
public class CommunityPost {

    @Id
    private String id;
    private String userId;
    private String title;
    private String content;
    private String imageUrl;
    //private boolean verifiedPoster;
    private Map<String, Set<String>> reactions = new HashMap<>();
    private LocalDateTime createdAt;
    private boolean isDeleted = false;
    private int shareCount; //new - for likes, posts, shares 5/6/2025


    @DBRef
    private UserEntity user;

    @DBRef
    @JsonIgnoreProperties({"post"})
    private List<Comment> comments = new ArrayList<>();

    public CommunityPost(){

        this.createdAt = LocalDateTime.now();
        //this.comments = new ArrayList<>();
        this.reactions = new HashMap<>();
    }

    //Getters and Setters
    public String getId() {return id;}
    public void setId(String id) {this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTitle() {return title;}
    public void setTitle(String title){this.title = title; }

    public String getContent() {return content;}
    public void setContent(String content){this.content = content;}

    public String getImageUrl() {return imageUrl;}
    public void setImageUrl(String imageUrl){this.imageUrl = imageUrl;}

    //public boolean getVerifiedPoster() { return verifiedPoster; }
    //public void setVerifiedPoster(boolean verifiedPoster) { this.verifiedPoster = verifiedPoster; }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}

    public boolean isDeleted() {return isDeleted;}
    public void setDeleted(boolean deleted){isDeleted = deleted;}

    public Map<String, Set<String>> getReactions() { return reactions;}
    public void setReactions(Map<String, Set<String>> reactions) {this.reactions = reactions;}

    public UserEntity getUser() {return user;}

    public void setUser(UserEntity user){
        this.user = user;
    }
    public boolean isVerifiedPoster(){
       return user != null && user.getProfile() != null && Boolean.TRUE.equals(user.getProfile().getStatus());
    }
    //new - for likes, posts, shares 5/6/2025
    public int getShareCount() { return shareCount; }
    public void setShareCount(int shareCount) {this.shareCount = shareCount;}

    //new for comments
    public List<Comment> getComments(){ return comments; }
    public void setComments(List<Comment> comments) {this.comments = comments;}
}
