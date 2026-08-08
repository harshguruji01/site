<?php
// backend/admin/users.php
require_once '../auth/session.php';
requireLogin();

if ($_SESSION['role'] !== 'Admin') {
    header('HTTP/1.1 403 Forbidden');
    sendJson('error', 'Access denied. Admin privileges required.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJson('error', 'Invalid request method.');
}

try {
    // Fetch all users (exclude sensitive data)
    $stmt = $pdo->query("
        SELECT id, uuid, full_name, username, email, role, status, verified, registration_date, last_login 
        FROM users 
        ORDER BY registration_date DESC
    ");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Fetch stats
    $statsStmt = $pdo->query("SELECT status, COUNT(*) as count FROM users GROUP BY status");
    $stats = $statsStmt->fetchAll(PDO::FETCH_KEY_PAIR);

    sendJson('success', 'Users retrieved.', [
        'users' => $users,
        'stats' => $stats
    ]);
} catch (PDOException $e) {
    sendJson('error', 'Failed to retrieve users.');
}
?>
