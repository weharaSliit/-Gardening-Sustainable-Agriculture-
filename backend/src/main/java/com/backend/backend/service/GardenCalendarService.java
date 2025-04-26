package com.backend.backend.service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.backend.dto.NotificationDTO;
import com.backend.backend.entity.GardenCalendarEntity;
import com.backend.backend.repository.GardenCalendarRepository;

@Service
public class GardenCalendarService {

    @Autowired
    private GardenCalendarRepository gardenCalendarRepository;

    public List<NotificationDTO> getNotifications(String userId) {
        List<GardenCalendarEntity> entries = gardenCalendarRepository.findByUserId(userId);
        List<NotificationDTO> notifications = new ArrayList<>();

        LocalDateTime now = LocalDateTime.now();
        for (GardenCalendarEntity entry : entries) {
            Date harvestDate = entry.getStartDate();

            // Convert Date to LocalDateTime
            LocalDateTime harvestDateTime = harvestDate.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

            if (harvestDateTime.isAfter(now) && harvestDateTime.isBefore(now.plusHours(24))) {
                notifications.add(new NotificationDTO(
                    entry.getId(),
                    "Reminder: Harvest " + entry.getVegetable() + " starting on " + harvestDateTime.toLocalDate()
                ));
            }
        }
        return notifications;
    }
}