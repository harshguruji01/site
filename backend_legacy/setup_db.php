<?php
// backend/setup_db.php
require_once 'config.php';

try {
    // 1. Create Users Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) UNIQUE NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            mobile VARCHAR(20) DEFAULT NULL,
            gender ENUM('Male', 'Female', 'Other', 'Prefer not to say') DEFAULT 'Prefer not to say',
            dob DATE DEFAULT NULL,
            country VARCHAR(100) DEFAULT NULL,
            state VARCHAR(100) DEFAULT NULL,
            profile_picture VARCHAR(255) DEFAULT NULL,
            password_hash VARCHAR(255) NOT NULL,
            secret_pin_hash VARCHAR(255) NOT NULL,
            role ENUM('User', 'Admin') DEFAULT 'User',
            status ENUM('Active', 'Suspended', 'Banned') DEFAULT 'Active',
            verified TINYINT(1) DEFAULT 0,
            registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_login TIMESTAMP NULL,
            last_password_change TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 2. Create Login History Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS login_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            ip_address VARCHAR(45) NOT NULL,
            device_info VARCHAR(255) NOT NULL,
            browser VARCHAR(100) NOT NULL,
            os VARCHAR(100) NOT NULL,
            status ENUM('Success', 'Failed') DEFAULT 'Success',
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    echo "Database schema created successfully.";
} catch (PDOException $e) {
    echo "Error creating schema: " . $e->getMessage();
}
?>
