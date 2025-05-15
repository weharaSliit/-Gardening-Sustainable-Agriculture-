package com.backend.backend.repository;

import com.backend.backend.entity.GardenCalendarEntity;
import com.backend.backend.entity.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {

    List<Submission> findByChallengeIdOrderByScoreDesc(String challengeId);
    List<Submission> findByUserId(String userId);

    @Query("{ 'challengeId' : ?0 }")
    long countByChallengeId(String challengeId);

    String id(String id);
}
