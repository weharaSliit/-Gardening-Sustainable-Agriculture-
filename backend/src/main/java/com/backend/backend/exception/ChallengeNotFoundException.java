package com.backend.backend.exception;

public class ChallengeNotFoundException extends RuntimeException {
    public ChallengeNotFoundException(String challengeId) {
        super("Challenge with id " + challengeId + " not found");
    }


}
