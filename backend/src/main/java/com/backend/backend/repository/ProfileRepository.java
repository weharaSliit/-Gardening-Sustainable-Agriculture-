package com.backend.backend.repository;

import com.backend.backend.entity.ProfileEntity;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ProfileRepository extends MongoRepository<ProfileEntity,String> {
    Optional<ProfileEntity> findByUserId(String userId);


}
