package com.bbau.vehicledetection.backend.controller;

import com.bbau.vehicledetection.backend.entity.VehicleEntry;

import com.bbau.vehicledetection.backend.service.VehicleEntryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin("*")  // Allows requests from frontend
public class VehicleEntryController {

    @Autowired
    private VehicleEntryService vehicleEntryService;


    
    // ✅ Handle vehicle entry or exit
    @PostMapping("/entry")
    public VehicleEntry registerVehicleEntry(@RequestBody VehicleEntry vehicleEntry) {
        System.out.println("Received vehicle entry: " + vehicleEntry);
        return vehicleEntryService.handleVehicleEntryOrExit(vehicleEntry);
    }

    // ✅ Get list of vehicles currently inside
    @GetMapping("/inside")
    public List<VehicleEntry> getVehiclesInside() {
        return vehicleEntryService.getAllActiveVehicles();
    }

    // ✅ Mark vehicle exit
    @PutMapping("/exit/{vehicleNumber}/{exitGate}")
    public VehicleEntry markVehicleExit(@PathVariable String vehicleNumber, @PathVariable int exitGate) {
        return vehicleEntryService.updateExit(vehicleNumber, exitGate);
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

}



    //------------------METHODS---------------
//     public VehicleEntry handleVehicleEntryOrExit(VehicleEntry vehicleEntry) {
//     // Get today's date
//     LocalDate today = LocalDate.now();

//     // Check if the vehicle has an active entry for today
//     List<VehicleEntry> entries = vehicleEntryRepository.findByVehicleNumber(vehicleEntry.getVehicleNumber());
//     for (VehicleEntry entry : entries) {
//         if (entry.getDate().equals(today) && entry.getStatus() == VehicleStatus.IN) {
//             // If the vehicle is already inside, mark it as exited
//             entry.setExitTime(LocalDateTime.now());
//             entry.setExitGate(vehicleEntry.getEntryGate()); // Use the current gate as the exit gate
//             entry.setStatus(VehicleStatus.OUT);
//             return vehicleEntryRepository.save(entry);
//         }
//     }

//     // If no active entry exists for today, register a new entry
//     vehicleEntry.setEntryTime(LocalDateTime.now());
//     vehicleEntry.setDate(today);
//     vehicleEntry.setStatus(VehicleStatus.IN);
//     return vehicleEntryRepository.save(vehicleEntry);
// }
// }


