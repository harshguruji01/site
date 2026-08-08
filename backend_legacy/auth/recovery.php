<?php
// backend/auth/recovery.php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

$identifier = trim($_POST['identifier'] ?? '');
$secretPin = $_POST['secret_pin'] ?? '';
$newPassword = $_POST['new_password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';

if (empty($identifier) || empty($secretPin) || empty($newPassword)) {
    sendJson('error', 'All fields are required.');
}

if ($newPassword !== $confirmPassword) {
    sendJson('error', 'New passwords do not match.');
}

if (strlen($newPassword) < 8) {
    sendJson('error', 'Password must be at least 8 characters long.');
}

try {
    // Find user
    $stmt = $pdo->prepare("SELECT id, secret_pin_hash FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$identifier, strtolower($identifier)]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        usleep(500000);
        sendJson('error', 'Invalid details provided.');
    }

    // Verify Secret PIN
    if (password_verify($secretPin, $user['secret_pin_hash'])) {
        // PIN matches, update password
        $algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
        $newHash = password_hash($newPassword, $algo);

        $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ?, last_password_change = CURRENT_TIMESTAMP WHERE id = ?");
        $updateStmt->execute([$newHash, $user['id']]);

        // In a real system, you would also clear all active session tokens here
        sendJson('success', 'Password reset successfully. Please log in with your new password.');
    } else {
        usleep(500000);
        sendJson('error', 'Invalid details provided.');
    }
} catch (PDOException $e) {
    sendJson('error', 'Database error occurred.');
}
?>
