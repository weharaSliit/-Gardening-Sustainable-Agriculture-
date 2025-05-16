package com.backend.backend.dto;

public class CommentRequestDTO {
    private String userId;
    private String text;

    //constructor
    public CommentRequestDTO(){
    }

    public CommentRequestDTO(String userId, String text){
        this.userId = userId;
        this.text = text;
    }

    //Getters, setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
