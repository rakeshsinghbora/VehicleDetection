package com.bbau.vehicledetection.backend.service;

import com.bbau.vehicledetection.backend.entity.BlockedVehicle.BlockedVehicle;
import com.bbau.vehicledetection.backend.repository.BlockedVehicleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BlockedVehicleService {

    private final BlockedVehicleRepository blockedVehicleRepository;

    @Autowired
    public BlockedVehicleService(BlockedVehicleRepository blockedVehicleRepository) {
        this.blockedVehicleRepository = blockedVehicleRepository;
    }

    // Check if a vehicle is currently blocked
    public boolean isVehicleBlocked(String vehicleNumber) {
        return blockedVehicleRepository.existsByVehicleNumberAndStatus(vehicleNumber, BlockedVehicle.Status.BLOCKED);
    }

    // Get all vehicles (both blocked and allowed)
    public List<BlockedVehicle> getAllVehicles() {
        return blockedVehicleRepository.findAll();
    }

    // Get a blocked vehicle entry if exists
    public Optional<BlockedVehicle> getBlockedVehicle(String vehicleNumber) {
        return blockedVehicleRepository.findByVehicleNumberAndStatus(vehicleNumber, BlockedVehicle.Status.BLOCKED);
    }

    // Block a vehicle
public BlockedVehicle blockVehicle(String vehicleNumber, String blockedBy, String reason) {
    // Check if the vehicle is already blocked
    Optional<BlockedVehicle> existingVehicle = blockedVehicleRepository.findByVehicleNumberAndStatus(vehicleNumber, BlockedVehicle.Status.BLOCKED);
    if (existingVehicle.isPresent()) {
        throw new IllegalArgumentException("Vehicle is already blocked: " + vehicleNumber);
    }

    // Check if the vehicle's status is REMOVED
    Optional<BlockedVehicle> removedVehicle = blockedVehicleRepository.findByVehicleNumberAndStatus(vehicleNumber, BlockedVehicle.Status.REMOVED);
    if (removedVehicle.isPresent()) {
        // Update the existing entry to BLOCKED
        BlockedVehicle vehicle = removedVehicle.get();
        vehicle.setStatus(BlockedVehicle.Status.BLOCKED);
        vehicle.setBlockedBy(blockedBy);
        vehicle.setBlockedReason(reason);
        vehicle.setBlockedDate(LocalDateTime.now());
        vehicle.setAllowedBy(null); // Clear allowedBy
        vehicle.setAllowedReason(null); // Clear allowedReason
        vehicle.setAllowedDate(null); // Clear allowedDate
        return blockedVehicleRepository.save(vehicle);
    }

    // Create a new blocked vehicle entry
    BlockedVehicle vehicle = new BlockedVehicle();
    vehicle.setVehicleNumber(vehicleNumber);
    vehicle.setStatus(BlockedVehicle.Status.BLOCKED);
    vehicle.setBlockedBy(blockedBy);
    vehicle.setBlockedReason(reason);
    vehicle.setBlockedDate(LocalDateTime.now());
    return blockedVehicleRepository.save(vehicle);
}

    // Allow a previously blocked vehicle by vehicle number
    public BlockedVehicle allowVehicleByNumber(String vehicleNumber, String allowedBy, String reason) {
        // Find the blocked vehicle by its vehicle number
        BlockedVehicle vehicle = blockedVehicleRepository.findByVehicleNumberAndStatus(vehicleNumber, BlockedVehicle.Status.BLOCKED)
                .orElseThrow(() -> new RuntimeException("Blocked Vehicle not found"));

        // Update the vehicle's status and allowed details
        vehicle.setStatus(BlockedVehicle.Status.REMOVED);
        vehicle.setAllowedBy(allowedBy);
        vehicle.setAllowedReason(reason);
        vehicle.setAllowedDate(LocalDateTime.now());
        return blockedVehicleRepository.save(vehicle);
    }
}

