package com.bbau.vehicledetection.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbau.vehicledetection.backend.entity.User.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // When you query a database using findByUsername(), there’s a chance it might not find a user with that username.
//Instead of returning null, Optional makes it safe and explicit to handle the possible absence of a value.
    Optional<User> findByUsername(String username);
}
