package com.backend.backend.controller;

import com.backend.backend.dto.ProfileDTO;
import com.backend.backend.entity.ProfileEntity;
import com.backend.backend.repository.ProfileRepository;
import com.backend.backend.service.JWTService;
import com.backend.backend.service.ProfileService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final ProfileService profileService;
    private final JWTService jwtService;

    {/*Updated */}

    @Value("${upload.directory}")
    private String uploadDirectory;

    private final ProfileRepository profileRepository;

    public ProfileController(ProfileService profileService, JWTService jwtService,ProfileRepository profileRepository) {
        this.profileService = profileService;
        this.jwtService = jwtService;
        this.profileRepository = profileRepository;
    }

    @PostMapping("/upload-picture/{userId}")
    public ResponseEntity<?> uploadProfilePicture(
            @PathVariable String userId,
            @RequestParam("profilePicture") MultipartFile file
    ){
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded.");
        }

        try {
            // Save the file to the uploads directory
            String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get("uploads/images", filename);
            File directory = uploadPath.getParent().toFile();
            if (!directory.exists()) {
                directory.mkdirs();
            }
            file.transferTo(uploadPath);

            // Update the profile with the image URL
            ProfileEntity profile = profileRepository.findByUserId(userId).orElse(null);
            if (profile == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found.");
            }

            profile.setImage("/uploads/images/" + filename);
            profileRepository.save(profile);

            return ResponseEntity.ok().body("Profile picture uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading file: " + e.getMessage());
        }
    }

    @GetMapping("/profile")
public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
    try {
        if (token == null || !token.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authorization header is missing or invalid"));
        }

        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");

        ProfileDTO profile = profileService.getProfileByUserId(userId);
        if (profile == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Invalid user id"));
        }

        return ResponseEntity.ok(profile);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "An unexpected error occurred"));
    }
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