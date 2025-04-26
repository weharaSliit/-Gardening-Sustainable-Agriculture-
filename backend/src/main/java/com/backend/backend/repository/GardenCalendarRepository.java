package com.backend.backend.repository;

import com.backend.backend.entity.GardenCalendarEntity;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface GardenCalendarRepository extends MongoRepository<GardenCalendarEntity, String> {
    List<GardenCalendarEntity> findByUserId(String userId); // Add method to filter by userId
}
