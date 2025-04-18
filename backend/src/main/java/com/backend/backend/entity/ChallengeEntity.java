package com.backend.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document
public class ChallengeEntity {

    @Id
    private String challengeId;
    private String challengeTitle;
    private String challengeDescription;
    private List<Question> questions;
    private String badgeAwarded;

    //  Inner static class with full structure
    public static class Question {
        private String questionText;
        private List<String> options;
        private String correctAnswer;

        public Question() {
        }

        public Question(String questionText, List<String> options, String correctAnswer) {
            this.questionText = questionText;
            this.options = options;
            this.correctAnswer = correctAnswer;
        }

        public String getQuestionText() {
            return questionText;
        }

        public void setQuestionText(String questionText) {
            this.questionText = questionText;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public String getCorrectAnswer() {
            return correctAnswer;
        }

        public void setCorrectAnswer(String correctAnswer) {
            this.correctAnswer = correctAnswer;
        }
    }

    //  Constructors
    public ChallengeEntity() {
    }

    public ChallengeEntity(String challengeId, String challengeTitle, String challengeDescription, List<Question> questions, String badgeAwarded) {
        this.challengeId = challengeId;
        this.challengeTitle = challengeTitle;
        this.challengeDescription = challengeDescription;
        this.questions = questions;
        this.badgeAwarded = badgeAwarded;
    }

    // ✅ Getters and Setters
    public String getChallengeId() {
        return challengeId;
    }

    public void setChallengeId(String challengeId) {
        this.challengeId = challengeId;
    }

    public String getChallengeTitle() {
        return challengeTitle;
    }

    public void setChallengeTitle(String challengeTitle) {
        this.challengeTitle = challengeTitle;
    }

    public String getChallengeDescription() {
        return challengeDescription;
    }

    public void setChallengeDescription(String challengeDescription) {
        this.challengeDescription = challengeDescription;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public String getBadgeAwarded() {
        return badgeAwarded;
    }

    public void setBadgeAwarded(String badgeAwarded) {
        this.badgeAwarded = badgeAwarded;
    }
}
