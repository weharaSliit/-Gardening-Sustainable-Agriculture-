package com.backend.backend.repository;

import com.backend.backend.entity.ChallengeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ChallengeRepository extends MongoRepository<ChallengeEntity, String> {


    List<ChallengeEntity> findByIsPostedTrue();
    List<ChallengeEntity> findAll();

}
