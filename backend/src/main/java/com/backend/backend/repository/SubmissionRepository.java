package com.backend.backend.repository;

import com.backend.backend.entity.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubmissionRepository extends MongoRepository<Submission, String> {

    List<Submission> findByChallengeIdOrderByScoreDesc(String challengeId);

}
