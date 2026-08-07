<?php
// backend/auth/signup.php
require_once '../config.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

// Get POST data
$fullName = $_POST['full_name'] ?? '';
$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$mobile = $_POST['mobile'] ?? null;
$gender = $_POST['gender'] ?? 'Prefer not to say';
$dob = !empty($_POST['dob']) ? $_POST['dob'] : null;
$country = $_POST['country'] ?? null;
$state = $_POST['state'] ?? null;
$password = $_POST['password'] ?? '';
$confirmPassword = $_POST['confirm_password'] ?? '';
$secretPin = $_POST['secret_pin'] ?? '';
$confirmPin = $_POST['confirm_pin'] ?? '';
$terms = isset($_POST['terms']) ? true : false;

// 1. Validation
if (empty($fullName) || empty($username) || empty($email) || empty($password) || empty($secretPin)) {
    sendJson('error', 'Please fill in all required fields.');
}

if (!$terms) {
    sendJson('error', 'You must accept the terms and conditions.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJson('error', 'Invalid email address format.');
}

if ($password !== $confirmPassword) {
    sendJson('error', 'Passwords do not match.');
}

if (strlen($password) < 8) {
    sendJson('error', 'Password must be at least 8 characters long.');
}

if ($secretPin !== $confirmPin) {
    sendJson('error', 'Secret PINs do not match.');
}

if (!preg_match('/^\d{4,8}$/', $secretPin)) {
    sendJson('error', 'Secret PIN must be a 4 to 8 digit number.');
}

// 2. Check for duplicate Username or Email
try {
    $stmt = $pdo->prepare("SELECT id, username, email FROM users WHERE username = ? OR email = ?");
    $stmt->execute([$username, $email]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
        if (strtolower($existingUser['email']) === strtolower($email)) {
            sendJson('error', 'An account with this email already exists.');
        }
        if (strtolower($existingUser['username']) === strtolower($username)) {
            sendJson('error', 'This username is already taken.');
        }
    }
} catch (PDOException $e) {
    sendJson('error', 'Database error during validation.');
}

// 3. Security: Hash Password and Secret PIN
// Prefer Argon2id, fallback to Bcrypt if Argon2id is not available on the server
$algo = defined('PASSWORD_ARGON2ID') ? PASSWORD_ARGON2ID : PASSWORD_BCRYPT;
$passwordHash = password_hash($password, $algo);
$pinHash = password_hash($secretPin, $algo);

$uuid = generateUuid();

// 4. Insert User into Database
try {
    $stmt = $pdo->prepare("
        INSERT INTO users (uuid, full_name, username, email, mobile, gender, dob, country, state, password_hash, secret_pin_hash) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $uuid, $fullName, $username, strtolower($email), $mobile, $gender, $dob, $country, $state, $passwordHash, $pinHash
    ]);

    sendJson('success', 'Your account has been created successfully. You can now log in.');

} catch (PDOException $e) {
    sendJson('error', 'Failed to create account. Please try again later.');
}
?>
