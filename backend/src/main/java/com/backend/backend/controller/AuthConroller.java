package com.backend.backend.controller;

import com.backend.backend.dto.LoginRequestDTO;
import com.backend.backend.dto.LoginResponseDTO;
import com.backend.backend.dto.RegisterRequestDTO;
import com.backend.backend.dto.RegisterResponseDTO;
import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.UserRepository;
import com.backend.backend.service.AuthService;
import com.backend.backend.service.JWTService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthConroller {

    private final AuthService authService;
    private final JWTService jwtService;
    private final UserRepository userRepository;

    public AuthConroller(AuthService authService, JWTService jwtService, UserRepository userRepository) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserEntity> getAllUsers() {
        return authService.getAllUsers();
    }

    @PostMapping
    public UserEntity createUser(@RequestBody RegisterRequestDTO user) {
        return authService.createUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        LoginResponseDTO response = authService.login(loginRequest);
        if (response.getError() != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody RegisterRequestDTO registerData) {
        RegisterResponseDTO response = authService.register(registerData);
        if (response.getError() != null)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @PostMapping("/google-success")
    public ResponseEntity<?> googleLoginSuccess(@RequestBody Map<String, String> requestBody) {
        try {
            String idToken = requestBody.get("idToken");
            if (idToken == null || idToken.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "ID token is missing"));
            }
    
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList("184415282669-ts6p0120f740395ulkpt5shvbudpmvbq.apps.googleusercontent.com"))
                    .build();
    
            GoogleIdToken googleIdToken = verifier.verify(idToken);
            if (googleIdToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid ID token"));
            }
    
            GoogleIdToken.Payload payload = googleIdToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");
    
            // Check if the user exists or create a new one
            UserEntity user = userRepository.findByEmail(email).orElseGet(() -> {
                UserEntity newUser = new UserEntity();
                newUser.setName(name);
                newUser.setEmail(email);
                newUser.setUsername(email);
                return userRepository.save(newUser);
            });
    
            // Generate JWT token
            String jwtToken = jwtService.generateToken(user.getId(), user.getEmail());
    
            return ResponseEntity.ok(Map.of(
                    "message", "Google login successful",
                    "token", jwtToken,
                    "user", Map.of("id", user.getId(), "name", user.getName(), "email", user.getEmail())
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

}
