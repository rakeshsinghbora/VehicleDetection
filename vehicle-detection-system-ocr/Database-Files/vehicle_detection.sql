CREATE DATABASE vehicle_detection;
USE vehicle_detection;
CREATE TABLE vehicle_entries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL,
    entry_time DATETIME NOT NULL,
    exit_time DATETIME NULL,
    date DATE NOT NULL,
    vehicle_type ENUM('PRIVATE', 'COMMERCIAL', 'ELECTRIC', 'GOVERNMENT', 'OTHER') NOT NULL,
    entry_gate INT NOT NULL,
    exit_gate INT NULL,
    image_name VARCHAR(255) NOT NULL,
    status ENUM('IN', 'OUT') NOT NULL DEFAULT 'IN',
    CONSTRAINT unique_vehicle_entry UNIQUE (vehicle_number, status)
);


-- ALTER TABLE vehicle_detection.vehicle_entries MODIFY status ENUM('IN', 'OUT') NOT NULL;
-- ALTER TABLE vehicle_detection.vehicle_entries MODIFY vehicle_type ENUM('PRIVATE', 'COMMERCIAL', 'ELECTRIC', 'GOVERNMENT', 'OTHER') NOT NULL;