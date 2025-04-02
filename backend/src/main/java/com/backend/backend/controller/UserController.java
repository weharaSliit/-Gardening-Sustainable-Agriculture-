package com.backend.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.backend.backend.service.JWTService;

@RestController
public class UserController {

    private final JWTService jwtService;

    public UserController(JWTService jwtService) {
        this.jwtService = jwtService;
    }
    

    @GetMapping
    public String getHello() {
        return "Hello World";
    }

    @PostMapping("/login")
    public String login(){
        return null;
    }

    @GetMapping("/username")
    public String getUsername(@RequestParam String token){
        return jwtService.getUsername(token);
    }


}
