package com.bbau.vehicledetection.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.bbau.vehicledetection.backend.entity.User.User;
import com.bbau.vehicledetection.backend.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public boolean authenticateUser(String username, String rawPassword) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            String storedHashedPassword = userOpt.get().getPassword();
            return passwordEncoder.matches(rawPassword, storedHashedPassword);
        }
        return false;
    }
}
