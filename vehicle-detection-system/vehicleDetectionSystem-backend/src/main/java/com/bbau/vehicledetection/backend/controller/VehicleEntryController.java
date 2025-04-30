package com.bbau.vehicledetection.backend.controller;

import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleEntry;
import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleStatus;
import com.bbau.vehicledetection.backend.service.VehicleEntryService;
import com.bbau.vehicledetection.backend.service.WebSocketSender;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin("*") // Allows requests from frontend
public class VehicleEntryController {

    @Autowired
    private WebSocketSender webSocketSender;

    @Autowired
    private VehicleEntryService vehicleEntryService;

    // ✅ Handle vehicle entry or exit
    // @PostMapping("/entry")
    // public ResponseEntity<?> registerVehicleEntry(@RequestBody VehicleEntry
    // vehicleEntry) {
    // try {
    // vehicleEntryService.handleVehicleEntry(vehicleEntry); // Pass the entire
    // object
    // return ResponseEntity.ok("Vehicle entry processed successfully.");
    // } catch (Exception e) {
    // return ResponseEntity.badRequest().body(e.getMessage());
    // }
    // }

    //Get Statistics for Dashboard
    @GetMapping("/statistics/{date}")
    public ResponseEntity<VehicleStatistics> getVehicleStatistics(@PathVariable String date) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);
            VehicleStatistics statistics = vehicleEntryService.getVehicleStatistics(parsedDate);
            return ResponseEntity.ok(statistics);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //Get vehicles in a certain Time interval
    @GetMapping("/count/interval")
public ResponseEntity<?> getVehiclesCountByTimeInterval(
        @RequestParam String startTime,
        @RequestParam String endTime) {
    try {
        LocalDateTime start = LocalDateTime.parse(startTime); // Format: yyyy-MM-ddTHH:mm:ss
        LocalDateTime end = LocalDateTime.parse(endTime);     // Format: yyyy-MM-ddTHH:mm:ss
        
        long count = vehicleEntryService.getVehiclesCountByTimeInterval(start, end);
        
        return ResponseEntity.ok(new TimeIntervalCount(start, end, count));
    } catch (DateTimeParseException e) {
        return ResponseEntity.badRequest()
            .body("Invalid date format. Use format: yyyy-MM-ddTHH:mm:ss");
    }
}

@PostMapping("/entry")
    public ResponseEntity<String> registerVehicleEntry(@RequestBody VehicleEntry vehicleEntry) {
        try {
            VehicleEntry savedEntry = vehicleEntryService.handleVehicleEntry(vehicleEntry);
            
            if (savedEntry == null) {
                return ResponseEntity.ok("Blocked vehicle detected");
            }
            
            return ResponseEntity.ok("Vehicle entry processed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error processing vehicle entry: " + e.getMessage());
        }
    }

    // ✅ Get list of vehicles currently inside
    @GetMapping("/inside")
    public List<VehicleEntry> getVehiclesInside() {
        return vehicleEntryService.getAllActiveVehicles();
    }

    // ✅ Mark vehicle exit
    // @PutMapping("/exit/{vehicleNumber}/{exitGate}")
    // public VehicleEntry markVehicleExit(@PathVariable String vehicleNumber,
    // @PathVariable int exitGate) {
    // return vehicleEntryService.updateExit(vehicleNumber, exitGate);
    // }
    @PutMapping("/exit/{vehicleNumber}/{exitGate}")
    public ResponseEntity<VehicleEntry> markVehicleExit(@PathVariable String vehicleNumber,
            @PathVariable int exitGate) {
        VehicleEntry updatedEntry = vehicleEntryService.updateExit(vehicleNumber, exitGate);

        webSocketSender.send("/topic/vehicle-exit", updatedEntry);

        return ResponseEntity.ok(updatedEntry);
    }

    // ✅ Get all vehicle entries
    @GetMapping("/all")
    public List<VehicleEntry> getAllVehicleEntries() {
        return vehicleEntryService.getAllEntries();
    }

    // ✅ Get all rows for a specific vehicle number
    @GetMapping("/{vehicleNumber}")
    public List<VehicleEntry> getEntriesByVehicleNumber(@PathVariable String vehicleNumber) {
        return vehicleEntryService.getEntriesByVehicleNumber(vehicleNumber);
    }

    // ✅ Get all rows for a specific date
    @GetMapping("/date/{date}")
    public List<VehicleEntry> getEntriesByDate(@PathVariable String date) {
        LocalDate parsedDate = LocalDate.parse(date); // Parse the date string to LocalDate
        return vehicleEntryService.getEntriesByDate(parsedDate);
    }

    // ✅ Get all rows for a specific vehicle type
    @GetMapping("/type/{vehicleType}")
    public List<VehicleEntry> getEntriesByVehicleType(@PathVariable String vehicleType) {
        return vehicleEntryService.getEntriesByVehicleType(vehicleType);
    }



// DTO as an inner class
//DTO for STATISTICS
public static class VehicleStatistics {
    private long totalEntered;
    private long currentlyInside;
    private long currentlyOutside;
    private String date;

    // Constructor
    public VehicleStatistics(long totalEntered, long currentlyInside, long currentlyOutside, String date) {
        this.totalEntered = totalEntered;
        this.currentlyInside = currentlyInside;
        this.currentlyOutside = currentlyOutside;
        this.date = date;
    }

    // Getters and setters
    public long getTotalEntered() { return totalEntered; }
    public void setTotalEntered(long totalEntered) { this.totalEntered = totalEntered; }

    public long getCurrentlyInside() { return currentlyInside; }
    public void setCurrentlyInside(long currentlyInside) { this.currentlyInside = currentlyInside; }

    public long getCurrentlyOutside() { return currentlyOutside; }
    public void setCurrentlyOutside(long currentlyOutside) { this.currentlyOutside = currentlyOutside; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}

//DTO for Time interval
public static class TimeIntervalCount {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private long count;

    public TimeIntervalCount(LocalDateTime startTime, LocalDateTime endTime, long count) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.count = count;
    }

    // Getters
    public LocalDateTime getStartTime() { return startTime; }
    public LocalDateTime getEndTime() { return endTime; }
    public long getCount() { return count; }
}
}
// package com.bbau.vehicledetection.backend.controller;

// import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleEntry;
// import com.bbau.vehicledetection.backend.service.VehicleEntryService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.web.bind.annotation.*;

// import java.time.LocalDate;
// import java.util.List;

// @RestController
// @RequestMapping("/api/vehicles")
// @CrossOrigin("*") // Allows requests from frontend
// public class VehicleEntryController {

// @Autowired
// private VehicleEntryService vehicleEntryService;

// // Handle vehicle entry or exit
// @PostMapping("/entry")
// public VehicleEntry registerVehicleEntry(@RequestBody VehicleEntry
// vehicleEntry) {
// System.out.println("Received vehicle entry: " + vehicleEntry);
// return vehicleEntryService.handleVehicleEntryOrExit(vehicleEntry);
// }

// // Get list of vehicles currently inside
// @GetMapping("/inside")
// public List<VehicleEntry> getVehiclesInside() {
// return vehicleEntryService.getAllActiveVehicles();
// }

// // Mark vehicle exit
// @PutMapping("/exit/{vehicleNumber}/{exitGate}")
// public VehicleEntry markVehicleExit(@PathVariable String vehicleNumber,
// @PathVariable int exitGate) {
// return vehicleEntryService.updateExit(vehicleNumber, exitGate);
// }

// // Get all vehicle entries
// @GetMapping("/all")
// public List<VehicleEntry> getAllVehicleEntries() {
// return vehicleEntryService.getAllEntries();
// }

// // Get all rows for a specific vehicle number
// @GetMapping("/{vehicleNumber}")
// public List<VehicleEntry> getEntriesByVehicleNumber(@PathVariable String
// vehicleNumber) {
// return vehicleEntryService.getEntriesByVehicleNumber(vehicleNumber);
// }

// // Get all rows for a specific date
// @GetMapping("/date/{date}")
// public List<VehicleEntry> getEntriesByDate(@PathVariable String date) {
// LocalDate parsedDate = LocalDate.parse(date); // Parse the date string to
// LocalDate
// return vehicleEntryService.getEntriesByDate(parsedDate);
// }

// // Get all rows for a specific vehicle type
// @GetMapping("/type/{vehicleType}")
// public List<VehicleEntry> getEntriesByVehicleType(@PathVariable String
// vehicleType) {
// return vehicleEntryService.getEntriesByVehicleType(vehicleType);
// }

// }
