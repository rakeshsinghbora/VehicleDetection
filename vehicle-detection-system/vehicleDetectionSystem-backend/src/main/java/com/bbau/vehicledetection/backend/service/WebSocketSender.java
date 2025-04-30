package com.bbau.vehicledetection.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.bbau.vehicledetection.backend.entity.BlockedVehicle.BlockedVehicle;
import com.bbau.vehicledetection.backend.entity.VehicleEntry.VehicleEntry;

@Component
public class WebSocketSender {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void send(String destination, Object payload) {
        messagingTemplate.convertAndSend(destination, payload);
    }

    public void sendBlockedVehicleNotification(BlockedVehicle vehicle) {
        System.out.println("Sending blocked vehicle notification: " + vehicle.getVehicleNumber());
        send("/topic/blocked-vehicle", vehicle);
    }

    public void sendAllowedVehicleNotification(VehicleEntry vehicle) {
        System.out.println("Sending allowed vehicle notification: " + vehicle.getVehicleNumber());
        send("/topic/allowed-vehicle", vehicle);
    }
}
