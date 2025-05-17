package com.backend.backend.controller;

import com.backend.backend.dto.NotificationDTO;
import com.backend.backend.entity.GardenCalendarEntity;
import com.backend.backend.repository.GardenCalendarRepository;
import com.backend.backend.service.GardenCalendarService;
import com.backend.backend.service.JWTService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/garden-calendar")
@CrossOrigin("http://localhost:5173")
public class GardenCalendarController {

    @Autowired
    private GardenCalendarRepository gardenCalendarRepository;

    @Autowired
    private JWTService jwtService;

    @Autowired
    private GardenCalendarService gardenCalendarService;

    @GetMapping("/notifications")
    public List<NotificationDTO> getNotifications(@RequestHeader("Authorization") String token) {
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
        return gardenCalendarService.getNotifications(userId);
    }

    @GetMapping
    public List<GardenCalendarEntity> getUserEntries(@RequestHeader("Authorization") String token) {
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
        return gardenCalendarRepository.findByUserId(userId);
    }

    @PostMapping
    public GardenCalendarEntity addEntry(@RequestBody GardenCalendarEntity entry,
            @RequestHeader("Authorization") String token) {
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
        entry.setUserId(userId); // Associate the entry with the logged-in user
        return gardenCalendarRepository.save(entry);
    }

    @PutMapping("/{id}")
    public GardenCalendarEntity updateEntry(@PathVariable String id, @RequestBody GardenCalendarEntity updatedEntry,
            @RequestHeader("Authorization") String token) {
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
        return gardenCalendarRepository.findById(id).map(entry -> {
            if (!entry.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized access");
            }
            entry.setVegetable(updatedEntry.getVegetable());
            entry.setCategory(updatedEntry.getCategory());
            entry.setSowDate(updatedEntry.getSowDate());
            entry.setPlantDate(updatedEntry.getPlantDate());
            entry.setStartDate(updatedEntry.getStartDate());
            entry.setEndDate(updatedEntry.getEndDate());
            entry.setQuantity(updatedEntry.getQuantity());
            entry.setQuantityScale(updatedEntry.getQuantityScale());
            entry.setDescription(updatedEntry.getDescription());
            return gardenCalendarRepository.save(entry);
        }).orElseThrow(() -> new RuntimeException("Entry not found"));
    }

    @DeleteMapping("/{id}")
    public String deleteEntry(@PathVariable String id, @RequestHeader("Authorization") String token) {
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
        return gardenCalendarRepository.findById(id).map(entry -> {
            if (!entry.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized access");
            }
            gardenCalendarRepository.delete(entry);
            return "Entry deleted successfully";
        }).orElseThrow(() -> new RuntimeException("Entry not found"));
    }

    @GetMapping("/user-contributions")
    public ResponseEntity<List<Map<String, Object>>> getUserContributions() {
        List<GardenCalendarEntity> allEntries = gardenCalendarRepository.findAll();
        Map<String, Map<String, Object>> userContributions = new HashMap<>();
        int totalQuantity = 0;

        // Aggregate data and calculate total quantity
        for (GardenCalendarEntity entry : allEntries) {
            String userId = entry.getUserId();
            userContributions.putIfAbsent(userId, new HashMap<>());
            Map<String, Object> userData = userContributions.get(userId);

            int userQuantity = (int) userData.getOrDefault("totalQuantity", 0) + entry.getQuantity();
            userData.put("userId", userId);
            userData.put("totalQuantity", userQuantity);
            userData.put("entries", (int) userData.getOrDefault("entries", 0) + 1);

            totalQuantity += entry.getQuantity();
        }

        // Calculate contribution percentage for each user
        for (Map<String, Object> userData : userContributions.values()) {
            int userQuantity = (int) userData.get("totalQuantity");
            double percentage = (double) userQuantity / totalQuantity * 100;
            userData.put("contributionPercentage", Math.round(percentage * 100.0) / 100.0); // Round to 2 decimal places
        }

        return ResponseEntity.ok(new ArrayList<>(userContributions.values()));
    }
    

}