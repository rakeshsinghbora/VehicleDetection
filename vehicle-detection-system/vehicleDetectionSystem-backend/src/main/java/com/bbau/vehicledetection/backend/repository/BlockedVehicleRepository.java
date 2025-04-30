package com.bbau.vehicledetection.backend.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bbau.vehicledetection.backend.entity.BlockedVehicle.BlockedVehicle;

import java.util.Optional;

@Repository
public interface BlockedVehicleRepository extends JpaRepository<BlockedVehicle, Long> {


    Optional<BlockedVehicle> findByVehicleNumberAndStatus(String vehicleNumber, BlockedVehicle.Status status);

    boolean existsByVehicleNumberAndStatus(String vehicleNumber, BlockedVehicle.Status status);
}
