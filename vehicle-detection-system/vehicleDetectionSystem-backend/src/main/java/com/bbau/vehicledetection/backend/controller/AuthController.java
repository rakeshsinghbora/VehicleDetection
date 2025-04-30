package com.bbau.vehicledetection.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.bbau.vehicledetection.backend.service.UserService;
import com.bbau.vehicledetection.backend.service.WebSocketSender;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private WebSocketSender webSocketSender;

    @Autowired
    private UserService userService;

    // @PostMapping("/login")
    // public ResponseEntity<String> login(@RequestBody Map<String, String> loginData) {
    //     String username = loginData.get("username");
    //     String password = loginData.get("password");

    //     boolean isAuthenticated = userService.authenticateUser(username, password);

    //     if (isAuthenticated) {
    //         return ResponseEntity.ok("Login successful");
    //     } else {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    //     }
    // }

    @PostMapping("/login")
public ResponseEntity<String> login(@RequestBody Map<String, String> loginData) {
    String username = loginData.get("username");
    String password = loginData.get("password");

    boolean isAuthenticated = userService.authenticateUser(username, password);

    if (isAuthenticated) {
        webSocketSender.send("/topic/auth", Map.of(
            "type", "LOGIN",
            "username", username,
            "timestamp", LocalDateTime.now()
        ));
        return ResponseEntity.ok("Login successful");
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }
}

}
