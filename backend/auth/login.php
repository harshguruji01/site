<?php
// backend/auth/login.php
require_once '../config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

$identifier = trim($_POST['identifier'] ?? ''); // Can be username or email
$password = $_POST['password'] ?? '';
$remember = isset($_POST['remember']) ? true : false;

if (empty($identifier) || empty($password)) {
    sendJson('error', 'Username/Email and Password are required.');
}

// Security: Basic Rate Limiting / Lockout per IP (Optional enhancement)
// We will skip strict IP lockouts in this boilerplate, but login_history tracks failures.

try {
    // 1. Find user by Username or Email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$identifier, strtolower($identifier)]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Collect device/IP info for login history
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

    if (!$user) {
        // Delay to prevent timing attacks
        usleep(500000);
        sendJson('error', 'Invalid credentials.');
    }

    if ($user['status'] !== 'Active') {
        sendJson('error', 'Account is ' . strtolower($user['status']) . '. Please contact support.');
    }

    // 2. Verify Password
    if (password_verify($password, $user['password_hash'])) {
        
        // Success: Log history
        $logStmt = $pdo->prepare("INSERT INTO login_history (user_id, ip_address, device_info, browser, os, status) VALUES (?, ?, ?, ?, ?, 'Success')");
        // Quick parser for browser/os (in a real app use a library)
        $logStmt->execute([$user['id'], $ip, $userAgent, 'Browser', 'OS']);

        // Update last login
        $pdo->prepare("UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?")->execute([$user['id']]);

        // Regenerate session ID for security against session fixation
        session_regenerate_id(true);

        // Store session variables
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['uuid'] = $user['uuid'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['logged_in'] = true;
        
        // Generate CSRF Token for future requests
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }

        // If remember me, set persistent cookie (simplified, use secure tokens in production)
        if ($remember) {
            $token = bin2hex(random_bytes(64));
            // Store token in DB and set cookie (omitted for brevity, requires 'user_tokens' table)
        }

        sendJson('success', 'Login successful.', [
            'redirect' => 'profile.html'
        ]);

    } else {
        // Failed password
        $logStmt = $pdo->prepare("INSERT INTO login_history (user_id, ip_address, device_info, browser, os, status) VALUES (?, ?, ?, ?, ?, 'Failed')");
        $logStmt->execute([$user['id'], $ip, $userAgent, 'Browser', 'OS']);
        
        usleep(500000);
        sendJson('error', 'Invalid credentials.');
    }

} catch (PDOException $e) {
    sendJson('error', 'An internal server error occurred.');
}
?>
