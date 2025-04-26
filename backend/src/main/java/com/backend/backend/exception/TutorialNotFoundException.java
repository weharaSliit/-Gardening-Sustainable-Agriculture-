package com.backend.backend.exception;

public class TutorialNotFoundException extends RuntimeException {
    public TutorialNotFoundException(Long id) {
        super("Tutorial not found" + id );
    }
    public TutorialNotFoundException(String message) {
        super(message);
    }
}

