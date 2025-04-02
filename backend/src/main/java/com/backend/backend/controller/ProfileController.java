package com.backend.backend.controller;

import com.backend.backend.dto.ProfileDTO;
import com.backend.backend.service.JWTService;
import com.backend.backend.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final JWTService jwtService;

    public ProfileController(ProfileService profileService, JWTService jwtService) {
        this.profileService = profileService;
        this.jwtService = jwtService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable String userId, @RequestHeader("Authorization") String token) {
        try {
            if (token == null || !token.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Authorization header is missing or invalid"));
            }

            String extractedUserId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");

            if (!userId.equals(extractedUserId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
            }

            ProfileDTO profile = profileService.getProfileByUserId(userId);
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid user id"));
            }

            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            // Log the exception and return a 500 error with a meaningful message
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createProfile(@PathVariable String userId, @RequestBody ProfileDTO profileData,
            @RequestHeader("Authorization") String token) {
        // Extract the userId from the token
        String extractedUserId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");

        // Ensure the authenticated user matches the requested userId
        if (!userId.equals(extractedUserId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("error", "Access denied"));
        }

        // Create or update the profile
        ProfileDTO profile = profileService.createProfile(userId, profileData);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid user id"));
        }

        return ResponseEntity.ok(profile);
    }
}