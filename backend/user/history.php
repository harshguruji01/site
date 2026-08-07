<?php
// backend/user/history.php
require_once '../auth/session.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson('error', 'Invalid request method.');
}

try {
    // Get last 20 login attempts
    $stmt = $pdo->prepare("
        SELECT login_time, ip_address, device_info, browser, os, status 
        FROM login_history 
        WHERE user_id = ? 
        ORDER BY login_time DESC 
        LIMIT 20
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $history = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendJson('success', 'Login history retrieved.', $history);
} catch (PDOException $e) {
    sendJson('error', 'Failed to retrieve login history.');
}
?>
