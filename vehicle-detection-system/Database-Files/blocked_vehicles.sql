use vehicle_detection;
CREATE TABLE blocked_vehicles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    vehicle_number VARCHAR(20) NOT NULL,
    status ENUM('BLOCKED', 'REMOVED') NOT NULL DEFAULT 'BLOCKED',
    blocked_by VARCHAR(100) NOT NULL,
    blocked_reason VARCHAR(255),
    blocked_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    allowed_by VARCHAR(100),
    allowed_reason VARCHAR(255),
    allowed_date TIMESTAMP NULL
);
