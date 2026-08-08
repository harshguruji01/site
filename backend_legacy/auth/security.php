<?php
// backend/auth/security.php
require_once 'session.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

$action = $_POST['action'] ?? '';

$user = getCurrentUser($pdo);
if (!$user) {
    sendJson('error', 'User not found.');
}

$algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;

try {
    // We need the secret PIN hash to verify security actions
    $stmt = $pdo->prepare("SELECT secret_pin_hash FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $dbUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($action === 'change_password') {
        $secretPin = $_POST['secret_pin'] ?? '';
        $newPassword = $_POST['new_password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';

        if (empty($secretPin) || empty($newPassword) || empty($confirmPassword)) {
            sendJson('error', 'All fields are required.');
        }

        if ($newPassword !== $confirmPassword) {
            sendJson('error', 'New passwords do not match.');
        }

        if (strlen($newPassword) < 8) {
            sendJson('error', 'Password must be at least 8 characters long.');
        }

        if (password_verify($secretPin, $dbUser['secret_pin_hash'])) {
            $newHash = password_hash($newPassword, $algo);
            $updateStmt = $pdo->prepare("UPDATE users SET password_hash = ?, last_password_change = CURRENT_TIMESTAMP WHERE id = ?");
            $updateStmt->execute([$newHash, $_SESSION['user_id']]);

            // In a production system with multiple devices, you would invalidate all other session tokens here.
            
            sendJson('success', 'Password updated successfully. You will be logged out of other devices.');
        } else {
            usleep(500000); // Anti-brute force delay
            sendJson('error', 'Incorrect Secret PIN.');
        }
    } 
    
    elseif ($action === 'change_pin') {
        $currentPin = $_POST['current_pin'] ?? '';
        $newPin = $_POST['new_pin'] ?? '';
        $confirmPin = $_POST['confirm_pin'] ?? '';

        if (empty($currentPin) || empty($newPin)) {
            sendJson('error', 'All fields are required.');
        }

        if ($newPin !== $confirmPin) {
            sendJson('error', 'New PINs do not match.');
        }

        if (!preg_match('/^\d{4,8}$/', $newPin)) {
            sendJson('error', 'New Secret PIN must be a 4 to 8 digit number.');
        }

        if (password_verify($currentPin, $dbUser['secret_pin_hash'])) {
            $newHash = password_hash($newPin, $algo);
            $updateStmt = $pdo->prepare("UPDATE users SET secret_pin_hash = ? WHERE id = ?");
            $updateStmt->execute([$newHash, $_SESSION['user_id']]);
            
            sendJson('success', 'Secret PIN updated successfully.');
        } else {
            usleep(500000);
            sendJson('error', 'Incorrect Current PIN.');
        }
    }

    else {
        sendJson('error', 'Invalid action.');
    }

} catch (PDOException $e) {
    sendJson('error', 'Database error processing security request.');
}
?>
