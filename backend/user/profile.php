<?php
// backend/user/profile.php
require_once '../auth/session.php';

// Require user to be logged in
requireLogin();

$user = getCurrentUser($pdo);

if (!$user) {
    sendJson('error', 'User not found.');
}

// Handle GET request to fetch profile data
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Strip sensitive fields just in case
    unset($user['id']);
    sendJson('success', 'Profile data retrieved.', $user);
}

// Handle POST request to update profile
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Profile Update logic
    $fullName = $_POST['full_name'] ?? $user['full_name'];
    $mobile = $_POST['mobile'] ?? $user['mobile'];
    $gender = $_POST['gender'] ?? $user['gender'];
    $country = $_POST['country'] ?? $user['country'];
    $state = $_POST['state'] ?? $user['state'];

    try {
        $stmt = $pdo->prepare("UPDATE users SET full_name = ?, mobile = ?, gender = ?, country = ?, state = ? WHERE id = ?");
        $stmt->execute([$fullName, $mobile, $gender, $country, $state, $_SESSION['user_id']]);
        
        sendJson('success', 'Profile updated successfully.');
    } catch (PDOException $e) {
        sendJson('error', 'Failed to update profile.');
    }
}
?>
