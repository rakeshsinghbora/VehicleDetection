package com.bbau.vehicledetection.backend.entity.BlockedVehicle;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_vehicles")
public class BlockedVehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "vehicle_number", nullable = false, length = 20)
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.BLOCKED;

    @Column(name = "blocked_by", nullable = false, length = 100)
    private String blockedBy;

    @Column(name = "blocked_reason")
    private String blockedReason;

    @Column(name = "blocked_date", updatable = false)
    private LocalDateTime blockedDate;

    @Column(name = "allowed_by")
    private String allowedBy;

    @Column(name = "allowed_reason")
    private String allowedReason;

    @Column(name = "allowed_date")
    private LocalDateTime allowedDate;

    // Enum for status
    public enum Status {
        BLOCKED,
        REMOVED
    }


    //constructors
    public BlockedVehicle(){}
    
    public BlockedVehicle(Long id, String vehicleNumber, Status status, String blockedBy, String blockedReason,
            LocalDateTime blockedDate, String allowedBy, String allowedReason, LocalDateTime allowedDate) {
        this.id = id;
        this.vehicleNumber = vehicleNumber;
        this.status = status;
        this.blockedBy = blockedBy;
        this.blockedReason = blockedReason;
        this.blockedDate = blockedDate;
        this.allowedBy = allowedBy;
        this.allowedReason = allowedReason;
        this.allowedDate = allowedDate;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getBlockedBy() {
        return blockedBy;
    }

    public void setBlockedBy(String blockedBy) {
        this.blockedBy = blockedBy;
    }

    public String getBlockedReason() {
        return blockedReason;
    }

    public void setBlockedReason(String blockedReason) {
        this.blockedReason = blockedReason;
    }

    public LocalDateTime getBlockedDate() {
        return blockedDate;
    }

    public void setBlockedDate(LocalDateTime blockedDate) {
        this.blockedDate = blockedDate;
    }

    public String getAllowedBy() {
        return allowedBy;
    }

    public void setAllowedBy(String allowedBy) {
        this.allowedBy = allowedBy;
    }

    public String getAllowedReason() {
        return allowedReason;
    }

    public void setAllowedReason(String allowedReason) {
        this.allowedReason = allowedReason;
    }

    public LocalDateTime getAllowedDate() {
        return allowedDate;
    }

    public void setAllowedDate(LocalDateTime allowedDate) {
        this.allowedDate = allowedDate;
    }
}

