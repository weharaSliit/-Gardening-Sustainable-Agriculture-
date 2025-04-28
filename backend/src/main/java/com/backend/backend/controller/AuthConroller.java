package com.backend.backend.controller;

import com.backend.backend.dto.LoginRequestDTO;
import com.backend.backend.dto.LoginResponseDTO;
import com.backend.backend.dto.RegisterRequestDTO;
import com.backend.backend.dto.RegisterResponseDTO;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthConroller {

    private final AuthService authService;

    public AuthConroller(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public List<UserEntity> getAllUsers(){
        return authService.getAllUsers();
    }

    @PostMapping
    public UserEntity createUser(@RequestBody RegisterRequestDTO user){
        return authService.createUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.login(loginRequest);
        if(response.getError()!=null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO registerData) {
        RegisterResponseDTO response = authService.register(registerData);
        if(response.getError()!=null) return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }


}
