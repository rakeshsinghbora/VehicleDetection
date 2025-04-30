use vehicle_detection;
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
INSERT INTO users (username, password)
VALUES ('admin', '$2a$12$9Ma3poGaFPwmwbWnVTCVguildQdSITyP0NrriDT2oB899h1FamuLi');
