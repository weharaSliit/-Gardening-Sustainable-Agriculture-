package com.backend.backend.repository;

import com.backend.backend.entity.GardenCalendarEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GardenCalendarRepository extends JpaRepository<GardenCalendarEntity, Long> {
    List<GardenCalendarEntity> findByUserId(String userId);
    Optional<GardenCalendarEntity> findByIdAndUserId(Long id, String userId);
    boolean existsByIdAndUserId(Long id, String userId);
}