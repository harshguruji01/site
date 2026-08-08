<?php
// backend/auth/session.php
require_once __DIR__ . '/../config.php';

// Function to check if user is logged in
function requireLogin() {
    if (empty($_SESSION['logged_in']) || empty($_SESSION['user_id'])) {
        header('HTTP/1.1 401 Unauthorized');
        // If it's an AJAX request, return JSON, otherwise redirect
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            sendJson('error', 'Unauthorized. Please log in.');
        } else {
            header('Location: login.html');
            exit;
        }
    }
}

// Function to get current user details
function getCurrentUser($pdo) {
    if (empty($_SESSION['user_id'])) return null;
    
    $stmt = $pdo->prepare("SELECT id, uuid, full_name, username, email, mobile, gender, dob, country, state, profile_picture, role, status, verified, registration_date, last_login FROM users WHERE id = ? AND status = 'Active'");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // User might have been banned or deleted while session was active
        session_destroy();
        return null;
    }
    
    return $user;
}
?>
