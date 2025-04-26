package com.backend.backend.controller;

import com.backend.backend.entity.GardenCalendarEntity;
import com.backend.backend.exception.UnauthorizedException;
import com.backend.backend.repository.GardenCalendarRepository;
import com.backend.backend.service.JWTService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/garden-calendar")
@CrossOrigin(origins = "*")
public class GardenCalendarController {

    @Autowired
    private GardenCalendarRepository gardenCalendarRepository;

    @Autowired
    private JWTService jwtService;

    private void validateUserAccess(String token, String userId) {
        try {
            String tokenUserId = jwtService.getFieldFromToken(token.replace("Bearer ", ""), "userId").toString();
            if (!tokenUserId.equals(userId)) {
                throw new UnauthorizedException("Invalid user");
            }
        } catch (Exception e) {
            throw new UnauthorizedException("Invalid token");
        }
    }

    @GetMapping
    public List<GardenCalendarEntity> getAllEntries(
        @RequestParam String userId,
        @RequestHeader("Authorization") String token
    ) {
        validateUserAccess(token, userId);
        return gardenCalendarRepository.findByUserId(userId);
    }

    @PostMapping
    public GardenCalendarEntity addEntry(
        @RequestBody GardenCalendarEntity entry,
        @RequestParam String userId,
        @RequestHeader("Authorization") String token
    ) {
        validateUserAccess(token, userId);
        entry.setUserId(userId);
        return gardenCalendarRepository.save(entry);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GardenCalendarEntity> updateEntry(
        @PathVariable Long id,
        @RequestBody GardenCalendarEntity updatedEntry,
        @RequestParam String userId,
        @RequestHeader("Authorization") String token
    ) {
        validateUserAccess(token, userId);
        return gardenCalendarRepository.findByIdAndUserId(id, userId)
                .map(entry -> {
                    entry.setVegetable(updatedEntry.getVegetable());
                    entry.setPlantingDate(updatedEntry.getPlantingDate());
                    entry.setHarvestDate(updatedEntry.getHarvestDate());
                    entry.setNotes(updatedEntry.getNotes());
                    entry.setSeason(updatedEntry.getSeason());
                    entry.setCareInstructions(updatedEntry.getCareInstructions());
                    entry.setActive(updatedEntry.isActive());
                    GardenCalendarEntity savedEntry = gardenCalendarRepository.save(entry);
                    return ResponseEntity.ok(savedEntry);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEntry(
        @PathVariable Long id,
        @RequestParam String userId,
        @RequestHeader("Authorization") String token
    ) {
        validateUserAccess(token, userId);
        if (gardenCalendarRepository.existsByIdAndUserId(id, userId)) {
            gardenCalendarRepository.deleteById(id);
            return ResponseEntity.ok("Entry deleted successfully");
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GardenCalendarEntity> getEntryById(
        @PathVariable Long id,
        @RequestParam String userId,
        @RequestHeader("Authorization") String token
    ) {
        validateUserAccess(token, userId);
        return gardenCalendarRepository.findByIdAndUserId(id, userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
