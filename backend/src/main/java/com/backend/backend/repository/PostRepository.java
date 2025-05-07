package com.backend.backend.repository;

import com.backend.backend.entity.CommunityPost;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends MongoRepository<CommunityPost, String> {
    List<CommunityPost> findByIsDeletedFalse();
    Optional<CommunityPost> findById(String id);
}
