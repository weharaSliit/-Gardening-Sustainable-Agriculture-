package com.backend.backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
@Document(collection = "garden_calendar")
public class GardenCalendarEntity {
    @Id
    private String id;
    private String userId; // Add userId field
    private String vegetable;
    private Date sowDate;
    private Date plantDate;
    private Date startDate;
    private Date endDate;
    private int quantity;
    private String quantityScale;
    private String description;

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVegetable() {
        return vegetable;
    }

    public void setVegetable(String vegetable) {
        this.vegetable = vegetable;
    }

    public Date getSowDate() {
        return sowDate;
    }

    public void setSowDate(Date sowDate) {
        this.sowDate = sowDate;
    }

    public Date getPlantDate() {
        return plantDate;
    }

    public void setPlantDate(Date plantDate) {
        this.plantDate = plantDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }


    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }


    public String getQuantityScale() {
        return quantityScale;
    }

    public void setQuantityScale(String quantityScale) {
        this.quantityScale = quantityScale;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    
}