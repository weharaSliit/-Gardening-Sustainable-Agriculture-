package com.backend.backend.repository;
import com.backend.backend.entity.CommentReply;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentReplyRepository extends MongoRepository<CommentReply,String>{
}
