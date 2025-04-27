package com.backend.backend.controller;

import com.backend.backend.dto.NotificationDTO;
import com.backend.backend.entity.GardenCalendarEntity;
import com.backend.backend.repository.GardenCalendarRepository;
import com.backend.backend.service.GardenCalendarService;
import com.backend.backend.service.JWTService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
public GardenCalendarEntity addEntry(@RequestBody GardenCalendarEntity entry, @RequestHeader("Authorization") String token) {
    String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
    entry.setUserId(userId); // Associate the entry with the logged-in user
    return gardenCalendarRepository.save(entry);
}

    @PutMapping("/{id}")
    public GardenCalendarEntity updateEntry(@PathVariable String id, @RequestBody GardenCalendarEntity updatedEntry, @RequestHeader("Authorization") String token) {
        String userId = (String) jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId");
        return gardenCalendarRepository.findById(id).map(entry -> {
            if (!entry.getUserId().equals(userId)) {
                throw new RuntimeException("Unauthorized access");
            }
            entry.setVegetable(updatedEntry.getVegetable());
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
}