package com.backend.backend.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.backend.backend.entity.TutorialModel;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for TutorialModel documents.
 * Provides CRUD operations and custom finder methods.
 */
public interface TutorialRepository extends MongoRepository<TutorialModel, String> {

    /**
     * Find a tutorial by its custom tutorialId field.
     * @param tutorialId the unique business identifier
     * @return an Optional containing the matching TutorialModel, if found
     */
    Optional<TutorialModel> findByTutorialId(String tutorialId);

    /**
     * Retrieve all tutorials of a given type.
     * @param tutorialType e.g. "Vegetable Gardening"
     * @return list of matching tutorials
     */
    List<TutorialModel> findByTutorialType(String tutorialType);

    // Add more query methods as needed, for example:
    // List<TutorialModel> findByTitleContainingIgnoreCase(String keyword);
    // List<TutorialModel> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
