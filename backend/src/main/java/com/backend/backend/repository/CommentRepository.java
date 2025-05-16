package com.backend.backend.repository;

import com.backend.backend.entity.Comment;
import com.backend.backend.entity.CommunityPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {
    //new
    List<Comment> findByPostIdOrderByCreatedAtDesc(String postId);
    List<Comment> findByPost(CommunityPost post);
}
