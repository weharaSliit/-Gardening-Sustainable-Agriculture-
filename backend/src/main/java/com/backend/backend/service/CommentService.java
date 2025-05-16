package com.backend.backend.service;

import com.backend.backend.entity.Comment;
import com.backend.backend.entity.CommentReply;
import com.backend.backend.entity.CommunityPost;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.CommentReplyRepository;
import com.backend.backend.repository.CommentRepository;
import com.backend.backend.repository.PostRepository;
import com.backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private CommentReplyRepository commentReplyRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Comment> getCommentsByPostId(String postId){
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    public Comment reactToComment(String commentId, String userId, String type) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        Map<String, Set<String>> reactions = comment.getReactions();
        if (reactions == null){
            reactions = new HashMap<>();
        }
        Set<String> users = reactions.getOrDefault(type, new HashSet<>());
        if (users.contains(userId)) {
            users.remove(userId);
        } else {
            users.add(userId);
        }

        reactions.put(type, users);
        comment.setReactions(reactions);

        return commentRepository.save(comment);
    }

    //comment replies
    public void deleteComment(String postId, String commentId, String userId){
        CommunityPost post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(userId)) {
            throw new RuntimeException("Only the post owner can delete comments");
        }

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        comment.setDeleted(true);
        commentRepository.save(comment);
    }
    public CommentReply replyToComment(String commentId, String userId, String content){
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CommentReply reply = new CommentReply();
        reply.setParentComment(comment);
        reply.setUser(user);
        reply.setContent(content);
        reply.setCreatedAt(LocalDateTime.now());
        reply.setReactions(new HashMap<>());

        comment.getReplies().add(reply);
        commentRepository.save(comment);
        return commentReplyRepository.save(reply);
    }

}
