package com.bbau.vehicledetection.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "vehicle_entries")
public class VehicleEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "vehicle_number", nullable = false, unique = true)
    private String vehicleNumber;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime;

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(name = "vehicle_type", nullable = false)
    private VehicleType vehicleType;

    @Column(name = "entry_gate", nullable = false)
    private int entryGate;

    @Column(name = "exit_gate")
    private Integer exitGate;

    @Column(name = "image_name", nullable = false)
    private String imageName;

    @Enumerated(EnumType.STRING)
    
    @Column(name = "status", nullable = false)
    private VehicleStatus status;

    // Constructors
    public VehicleEntry() {}

    public VehicleEntry(String vehicleNumber, LocalDateTime entryTime, LocalDate date, VehicleType vehicleType, int entryGate, String imageName, VehicleStatus status) {
        this.vehicleNumber = vehicleNumber;
        this.entryTime = entryTime;
        this.date = date;
        this.vehicleType = vehicleType;
        this.entryGate = entryGate;
        this.imageName = imageName;
        this.status = status;
    }

    // Getters and Setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public LocalDateTime getEntryTime() { return entryTime; }
    public void setEntryTime(LocalDateTime entryTime) { this.entryTime = entryTime; }

    public LocalDateTime getExitTime() { return exitTime; }
    public void setExitTime(LocalDateTime exitTime) { this.exitTime = exitTime; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public VehicleType getVehicleType() { return vehicleType; }
    public void setVehicleType(VehicleType vehicleType) { this.vehicleType = vehicleType; }

    public int getEntryGate() { return entryGate; }
    public void setEntryGate(int entryGate) { this.entryGate = entryGate; }

    public Integer getExitGate() { return exitGate; }
    public void setExitGate(Integer exitGate) { this.exitGate = exitGate; }

    public String getImageName() { return imageName; }
    public void setImageName(String imageName) { this.imageName = imageName; }

    public VehicleStatus getStatus() { return status; }
    public void setStatus(VehicleStatus status) { this.status = status; }
    
}
