<?php
// backend/admin/actions.php
require_once '../auth/session.php';
requireLogin();

if ($_SESSION['role'] !== 'Admin') {
    header('HTTP/1.1 403 Forbidden');
    sendJson('error', 'Access denied.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

$action = $_POST['action'] ?? '';
$targetUserId = $_POST['user_id'] ?? '';

if (empty($action) || empty($targetUserId)) {
    sendJson('error', 'Action and target user are required.');
}

// Ensure Admin doesn't ban themselves
if ($targetUserId == $_SESSION['user_id']) {
    sendJson('error', 'You cannot perform this action on yourself.');
}

try {
    if ($action === 'suspend') {
        $stmt = $pdo->prepare("UPDATE users SET status = 'Suspended' WHERE id = ?");
        $stmt->execute([$targetUserId]);
        sendJson('success', 'User suspended.');
    } 
    elseif ($action === 'ban') {
        $stmt = $pdo->prepare("UPDATE users SET status = 'Banned' WHERE id = ?");
        $stmt->execute([$targetUserId]);
        sendJson('success', 'User banned.');
    }
    elseif ($action === 'activate') {
        $stmt = $pdo->prepare("UPDATE users SET status = 'Active' WHERE id = ?");
        $stmt->execute([$targetUserId]);
        sendJson('success', 'User activated.');
    }
    elseif ($action === 'delete') {
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$targetUserId]);
        sendJson('success', 'User deleted entirely.');
    }
    else {
        sendJson('error', 'Unknown action.');
    }
} catch (PDOException $e) {
    sendJson('error', 'Database error performing action.');
}
?>
