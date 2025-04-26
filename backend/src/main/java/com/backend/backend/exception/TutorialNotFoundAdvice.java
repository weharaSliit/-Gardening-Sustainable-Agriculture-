package com.backend.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class TutorialNotFoundAdvice {

    @ResponseBody
    @ExceptionHandler(TutorialNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String,String> exceptionHandler(TutorialNotFoundException ex) {
        Map<String,String> error = new HashMap<>();
        error.put("errorMessage", ex.getMessage());
        return error;
    }
}

