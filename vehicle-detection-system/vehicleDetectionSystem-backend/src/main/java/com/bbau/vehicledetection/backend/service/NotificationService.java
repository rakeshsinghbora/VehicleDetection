package com.bbau.vehicledetection.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import com.bbau.vehicledetection.backend.entity.BlockedVehicle.BlockedVehicle;
import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleEntry;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void sendBlockedVehicleNotification(BlockedVehicle blockedVehicle) {
        System.out.println("Sending blocked vehicle notification: " + blockedVehicle.getVehicleNumber());
        messagingTemplate.convertAndSend("/topic/blocked-vehicle", blockedVehicle);
    }

    public void sendAllowedVehicleNotification(VehicleEntry vehicleEntry) {
        System.out.println("Sending allowed vehicle notification: " + vehicleEntry.getVehicleNumber());
        messagingTemplate.convertAndSend("/topic/allowed-vehicle", vehicleEntry);
    }
}
