package com.backend.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.HashMap;
import java.util.Map;

@ControllerAdvice

public class ChallengeNotFoundAdvice {
    @ResponseBody
    @ExceptionHandler(ChallengeNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)

    public Map<String, String> exceptionHandler (ChallengeNotFoundException exception) {
        Map<String, String> errormap = new HashMap<>();
        errormap.put("errorMessage", exception.getMessage());
        return errormap;
    }
}
