package com.backend.backend.exception;

public class PostNotFoundException extends RuntimeException {
  public PostNotFoundException(String id) {

    super("Post with ID " + id + " not found.");
  }
}
