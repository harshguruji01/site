<?php
// backend/store/setup_store_db.php
require_once '../config.php';

try {
    // 1. Categories Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS store_categories (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            parent_id INT DEFAULT NULL,
            icon VARCHAR(100) DEFAULT NULL,
            FOREIGN KEY (parent_id) REFERENCES store_categories(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 2. Apps Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS store_apps (
            id INT AUTO_INCREMENT PRIMARY KEY,
            slug VARCHAR(150) UNIQUE NOT NULL,
            name VARCHAR(150) NOT NULL,
            developer VARCHAR(150) NOT NULL,
            short_description VARCHAR(255),
            description TEXT,
            features TEXT,
            package_name VARCHAR(150) UNIQUE,
            os ENUM('Windows', 'Android', 'Linux', 'macOS', 'Cross-Platform') NOT NULL,
            license ENUM('Free', 'Freemium', 'Paid', 'Open Source', 'Mod') DEFAULT 'Free',
            icon_url VARCHAR(255),
            banner_url VARCHAR(255),
            official_website VARCHAR(255),
            status ENUM('Published', 'Draft', 'Hidden') DEFAULT 'Published',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 3. App Screenshots
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS store_screenshots (
            id INT AUTO_INCREMENT PRIMARY KEY,
            app_id INT NOT NULL,
            image_url VARCHAR(255) NOT NULL,
            display_order INT DEFAULT 0,
            FOREIGN KEY (app_id) REFERENCES store_apps(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 4. App Categories Link Table (Many-to-Many)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS store_app_categories (
            app_id INT NOT NULL,
            category_id INT NOT NULL,
            PRIMARY KEY (app_id, category_id),
            FOREIGN KEY (app_id) REFERENCES store_apps(id) ON DELETE CASCADE,
            FOREIGN KEY (category_id) REFERENCES store_categories(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 5. App Versions (Releases)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS store_app_versions (
            id INT AUTO_INCREMENT PRIMARY KEY,
            app_id INT NOT NULL,
            version_number VARCHAR(50) NOT NULL,
            changelog TEXT,
            release_date DATE,
            architecture ENUM('x86', 'x64', 'ARM', 'Universal') DEFAULT 'Universal',
            file_size_bytes BIGINT,
            min_os_requirement VARCHAR(100),
            sha256_hash VARCHAR(64),
            md5_hash VARCHAR(32),
            primary_download_url VARCHAR(255),
            mirror_download_url VARCHAR(255),
            official_store_url VARCHAR(255),
            downloads_count BIGINT DEFAULT 0,
            is_latest TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (app_id) REFERENCES store_apps(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 6. App Reviews
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS store_reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            app_id INT NOT NULL,
            user_id INT NOT NULL,
            rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            review_text TEXT,
            helpful_votes INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (app_id) REFERENCES store_apps(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    echo "Store database schema created successfully.";
} catch (PDOException $e) {
    echo "Error creating schema: " . $e->getMessage();
}
?>
