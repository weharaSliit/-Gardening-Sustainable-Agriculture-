package com.backend.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

/**
 * Represents a gardening tutorial/course in MongoDB.
 */
@Document(collection = "tutorials")
// This annotation indicates that this class is a MongoDB document and will be stored in the "tutorials" collection.
// The @Document annotation is part of Spring Data MongoDB and is used to map a Java class to a MongoDB document.
public class TutorialModel {

    // ——— Core identifiers ———
    @Id
    private String id;
    private String tutorialId;
    private String title;
    private String description;
    private String tutorialType;

    // ——— Media ———
    private String tutorialImage;
    private List<String> mediaUrls;

    // ——— Classification & difficulty ———
    private List<String> categories;
    private String difficulty;
    private String estimatedDuration;

    // ——— Structure & resources ———
    private List<OutlineStep> outline;
    private List<String> learningOutcomes;

    // ——— Extras ———
    private List<String> skillsGained;
    private List<Detail> detailsToKnow;

    // ——— Constructors ———
    public TutorialModel() {}

    public TutorialModel(
        String id,
        String tutorialId,
        String title,
        String description,
        String tutorialType,
        String tutorialImage,
        List<String> mediaUrls,
        List<String> categories,
        String difficulty,
        String estimatedDuration,
        List<OutlineStep> outline,
        List<String> learningOutcomes,
        List<String> skillsGained,
        List<Detail> detailsToKnow
    ) {
        this.id = id;
        this.tutorialId = tutorialId;
        this.title = title;
        this.description = description;
        this.tutorialType = tutorialType;
        this.tutorialImage = tutorialImage;
        this.mediaUrls = mediaUrls;
        this.categories = categories;
        this.difficulty = difficulty;
        this.estimatedDuration = estimatedDuration;
        this.outline = outline;
        this.learningOutcomes = learningOutcomes;
        this.skillsGained = skillsGained;
        this.detailsToKnow = detailsToKnow;
    }

    // ——— Getters & Setters ———
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTutorialId() { return tutorialId; }
    public void setTutorialId(String tutorialId) { this.tutorialId = tutorialId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTutorialType() { return tutorialType; }
    public void setTutorialType(String tutorialType) { this.tutorialType = tutorialType; }

    public String getTutorialImage() { return tutorialImage; }
    public void setTutorialImage(String tutorialImage) { this.tutorialImage = tutorialImage; }

    public List<String> getMediaUrls() { return mediaUrls; }
    public void setMediaUrls(List<String> mediaUrls) { this.mediaUrls = mediaUrls; }

    public List<String> getCategories() { return categories; }
    public void setCategories(List<String> categories) { this.categories = categories; }

    public String getDifficulty() { return difficulty; }
    public void setDifficulty(String difficulty) { this.difficulty = difficulty; }

    public String getEstimatedDuration() { return estimatedDuration; }
    public void setEstimatedDuration(String estimatedDuration) { this.estimatedDuration = estimatedDuration; }

    public List<OutlineStep> getOutline() { return outline; }
    public void setOutline(List<OutlineStep> outline) { this.outline = outline; }

    public List<String> getLearningOutcomes() { return learningOutcomes; }
    public void setLearningOutcomes(List<String> learningOutcomes) { this.learningOutcomes = learningOutcomes; }

    public List<String> getSkillsGained() { return skillsGained; }
    public void setSkillsGained(List<String> skillsGained) { this.skillsGained = skillsGained; }

    public List<Detail> getDetailsToKnow() { return detailsToKnow; }
    public void setDetailsToKnow(List<Detail> detailsToKnow) { this.detailsToKnow = detailsToKnow; }

    // ——— Nested helper classes ———
    public static class OutlineStep {
        private int stepNumber;
        private String title;
        private String content;

        public OutlineStep() {}
        public OutlineStep(int stepNumber, String title, String content) {
            this.stepNumber = stepNumber;
            this.title = title;
            this.content = content;
        }

        public int getStepNumber() { return stepNumber; }
        public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getContent() { return content; }
        public void setContent(String content) { this.content = content; }
    }

    public static class Detail {
        private String label;
        private String value;

        public Detail() {}
        public Detail(String label, String value) {
            this.label = label;
            this.value = value;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public String getValue() { return value; }
        public void setValue(String value) { this.value = value; }
    }
}
