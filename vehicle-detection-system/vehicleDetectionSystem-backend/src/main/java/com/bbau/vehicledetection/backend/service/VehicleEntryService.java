package com.bbau.vehicledetection.backend.service;

import com.bbau.vehicledetection.backend.controller.VehicleEntryController;
import com.bbau.vehicledetection.backend.entity.BlockedVehicle.BlockedVehicle;
import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleEntry;
import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleStatus;
import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleType;
import com.bbau.vehicledetection.backend.repository.BlockedVehicleRepository;
import com.bbau.vehicledetection.backend.repository.VehicleEntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class VehicleEntryService {

    @Autowired
    private VehicleEntryRepository vehicleEntryRepository;

    @Autowired
    private BlockedVehicleRepository blockedVehicleRepository;

    @Autowired
    private WebSocketSender webSocketSender;

    @Autowired
    private NotificationService notificationService;
    //Get Vehicle count during a time interval
    public long getVehiclesCountByTimeInterval(LocalDateTime startTime, LocalDateTime endTime) {
        return vehicleEntryRepository.countByEntryTimeBetween(startTime, endTime);
    }
    
    // ✅ Handle vehicle entry or exit
    public VehicleEntry handleVehicleEntry(VehicleEntry vehicleEntry) {
        // Check if vehicle is blocked
        Optional<BlockedVehicle> blockedVehicle = blockedVehicleRepository.findByVehicleNumberAndStatus(
            vehicleEntry.getVehicleNumber(), BlockedVehicle.Status.BLOCKED
        );

        if (blockedVehicle.isPresent()) {
            webSocketSender.sendBlockedVehicleNotification(blockedVehicle.get());
            return null;
        }

        // Process normal entry/exit
        List<VehicleEntry> activeEntries = vehicleEntryRepository.findByVehicleNumber(vehicleEntry.getVehicleNumber());
        Optional<VehicleEntry> lastEntry = activeEntries.stream()
            .filter(entry -> entry.getStatus() == VehicleStatus.IN)
            .findFirst();

        if (lastEntry.isPresent()) {
            // Update existing entry to OUT
            VehicleEntry entry = lastEntry.get();
            entry.setExitTime(LocalDateTime.now());
            entry.setExitGate(vehicleEntry.getEntryGate());
            entry.setStatus(VehicleStatus.OUT);
            return vehicleEntryRepository.save(entry);
        } else {
            // Create new entry
            vehicleEntry.setEntryTime(LocalDateTime.now());
            vehicleEntry.setDate(LocalDate.now());
            vehicleEntry.setStatus(VehicleStatus.IN);
            VehicleEntry savedEntry = vehicleEntryRepository.save(vehicleEntry);
            webSocketSender.sendAllowedVehicleNotification(savedEntry);
            return savedEntry;
        }
    }

    // ✅ Get all active vehicles
    public List<VehicleEntry> getAllActiveVehicles() {
        return vehicleEntryRepository.findByStatus(VehicleStatus.IN);
    }

    // ✅ Mark vehicle exit
    public VehicleEntry updateExit(String vehicleNumber, int exitGate) {
        List<VehicleEntry> entries = vehicleEntryRepository.findByVehicleNumber(vehicleNumber);
        for (VehicleEntry entry : entries) {
            if (entry.getStatus() == VehicleStatus.IN) {
                entry.setExitTime(LocalDateTime.now());
                entry.setExitGate(exitGate);
                entry.setStatus(VehicleStatus.OUT);
                return vehicleEntryRepository.save(entry);
            }
        }
        throw new RuntimeException("Vehicle not found or already exited");
    }

    // ✅ Get all vehicle entries
    public List<VehicleEntry> getAllEntries() {
        return vehicleEntryRepository.findAll();
    }

    // ✅ Get all rows for a specific vehicle number
    public List<VehicleEntry> getEntriesByVehicleNumber(String vehicleNumber) {
        return vehicleEntryRepository.findAllByVehicleNumber(vehicleNumber);
    }

    // ✅ Get all rows for a specific date
    public List<VehicleEntry> getEntriesByDate(LocalDate date) {
        return vehicleEntryRepository.findAllByDate(date);
    }

    // ✅ Get all rows for a specific vehicle type
    public List<VehicleEntry> getEntriesByVehicleType(String vehicleType) {
        VehicleType type = VehicleType.valueOf(vehicleType.toUpperCase()); // Convert String to ENUM
        return vehicleEntryRepository.findAllByVehicleType(type);
    }


public VehicleEntryController.VehicleStatistics getVehicleStatistics(LocalDate date) {
    List<VehicleEntry> entriesForDate = vehicleEntryRepository.findAllByDate(date);
    
    long totalEntered = entriesForDate.size();
    long currentlyInside = entriesForDate.stream()
            .filter(entry -> entry.getStatus() == VehicleStatus.IN)
            .count();
    long currentlyOutside = entriesForDate.stream()
            .filter(entry -> entry.getStatus() == VehicleStatus.OUT)
            .count();

    return new VehicleEntryController.VehicleStatistics(
            totalEntered,
            currentlyInside,
            currentlyOutside,
            date.toString()
    );
}
}





// package com.bbau.vehicledetection.backend.service;

// import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleEntry;
// import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleStatus;
// import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleType;
// import com.bbau.vehicledetection.backend.repository.VehicleEntryRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import java.time.LocalDateTime;
// import java.time.LocalDate;
// import java.util.List;


// @Service
// public class VehicleEntryService {

//     @Autowired
//     private VehicleEntryRepository vehicleEntryRepository;

//     // ✅ Handle vehicle entry or exit
//     public VehicleEntry handleVehicleEntryOrExit(VehicleEntry vehicleEntry) {
//         // Get today's date
//         LocalDate today = LocalDate.now();

//         // Check if the vehicle has an active entry for today
//         List<VehicleEntry> entries = vehicleEntryRepository.findByVehicleNumber(vehicleEntry.getVehicleNumber());
//         for (VehicleEntry entry : entries) {
//             if (entry.getDate().equals(today) && entry.getStatus() == VehicleStatus.IN) {
//                 // If the vehicle is already inside, mark it as exited
//                 entry.setExitTime(LocalDateTime.now());
//                 entry.setExitGate(vehicleEntry.getEntryGate()); // Use the current gate as the exit gate
//                 entry.setStatus(VehicleStatus.OUT);
//                 return vehicleEntryRepository.save(entry);
//             }
//         }

//         // If no active entry exists for today, register a new entry
//         vehicleEntry.setEntryTime(LocalDateTime.now());
//         vehicleEntry.setDate(today);
//         vehicleEntry.setStatus(VehicleStatus.IN);
//         return vehicleEntryRepository.save(vehicleEntry);
//     }

//     // ✅ Get all active vehicles
//     public List<VehicleEntry> getAllActiveVehicles() {
//         return vehicleEntryRepository.findByStatus(VehicleStatus.IN);
//     }

//     // ✅ Mark vehicle exit
//     public VehicleEntry updateExit(String vehicleNumber, int exitGate) {
//         List<VehicleEntry> entries = vehicleEntryRepository.findByVehicleNumber(vehicleNumber);
//         for (VehicleEntry entry : entries) {
//             if (entry.getStatus() == VehicleStatus.IN) {
//                 entry.setExitTime(LocalDateTime.now());
//                 entry.setExitGate(exitGate);
//                 entry.setStatus(VehicleStatus.OUT);
//                 return vehicleEntryRepository.save(entry);
//             }
//         }
//         throw new RuntimeException("Vehicle not found or already exited");
//     }

//     // ✅ Get all vehicle entries
//     public List<VehicleEntry> getAllEntries() {
//         return vehicleEntryRepository.findAll();
//     }

//     // ✅ Get all rows for a specific vehicle number
//     public List<VehicleEntry> getEntriesByVehicleNumber(String vehicleNumber) {
//         return vehicleEntryRepository.findAllByVehicleNumber(vehicleNumber);
//     }

//     // ✅ Get all rows for a specific date
//     public List<VehicleEntry> getEntriesByDate(LocalDate date) {
//         return vehicleEntryRepository.findAllByDate(date);

    
// }

// // ✅ Get all rows for a specific vehicle type
// public List<VehicleEntry> getEntriesByVehicleType(String vehicleType) {
//         VehicleType type = VehicleType.valueOf(vehicleType.toUpperCase()); // Convert String to ENUM
//         return vehicleEntryRepository.findAllByVehicleType(type);
//     }


// }


