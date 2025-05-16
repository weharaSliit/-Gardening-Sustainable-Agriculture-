package com.backend.backend.controller;

import com.backend.backend.entity.UserEntity;
import com.backend.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "http://localhost:5173") // Adjust for your frontend origin
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public ResponseEntity<List<UserEntity>> getAllUsers() {
        try {
            List<UserEntity> users = userRepository.findAll();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable String id) {
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to delete user");
        }
    }

    @GetMapping("/admin/admin-garden-logs")
public ResponseEntity<List<Map<String, Object>>> getMonthlyGardenLogAnalytics() {
    try {
        // Mock data for monthly analytics with categories
        List<Map<String, Object>> analytics = List.of(
            Map.of("month", "January", "logs", 50, "category", "Vegetables"),
            Map.of("month", "February", "logs", 40, "category", "Fruits"),
            Map.of("month", "March", "logs", 60, "category", "Herbs"),
            Map.of("month", "April", "logs", 30, "category", "Flowers"),
            Map.of("month", "May", "logs", 70, "category", "Vegetables")
        );
        return ResponseEntity.ok(analytics);
    } catch (Exception e) {
        return ResponseEntity.status(500).body(null);
    }
}

    
}