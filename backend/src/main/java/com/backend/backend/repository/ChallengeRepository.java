package com.backend.backend.repository;

import com.backend.backend.entity.ChallengeEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ChallengeRepository extends MongoRepository<ChallengeEntity, String> {



}
