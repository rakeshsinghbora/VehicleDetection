package com.bbau.vehicledetection.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
public class VehicleDetectionSystemApplication {

	public static void main(String[] args) {

		// Dotenv dotenv = Dotenv.load();
        // System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
        // System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));

		SpringApplication.run(VehicleDetectionSystemApplication.class, args);
	}

}
