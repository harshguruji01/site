<?php
// backend/admin/add_app.php
require_once '../auth/session.php';
requireLogin();

if ($_SESSION['role'] !== 'Admin') {
    sendJson('error', 'Admin privileges required.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

$slug = $_POST['slug'] ?? '';
$name = $_POST['name'] ?? '';
$dev = $_POST['developer'] ?? '';
$os = $_POST['os'] ?? 'Windows';
$license = $_POST['license'] ?? 'Free';
$shortDesc = $_POST['short_description'] ?? '';
$iconUrl = $_POST['icon_url'] ?? '';
$instructions = $_POST['instructions'] ?? '';
$apkUrl = $_POST['apk_url'] ?? '';

if (empty($slug) || empty($name) || empty($dev)) {
    sendJson('error', 'Slug, Name, and Developer are required.');
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO store_apps (slug, name, developer, os, license, short_description, features, icon_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([$slug, $name, $dev, $os, $license, $shortDesc, $instructions, $iconUrl]);
    $appId = $pdo->lastInsertId();

    // Insert dummy initial version with APK url
    $verStmt = $pdo->prepare("
        INSERT INTO store_app_versions (app_id, version_number, primary_download_url, is_latest)
        VALUES (?, '1.0.0', ?, 1)
    ");
    $verStmt->execute([$appId, $apkUrl]);

    sendJson('success', 'App added successfully. ID: ' . $appId);
} catch (PDOException $e) {
    if ($e->getCode() == 23000) { // Duplicate entry
        sendJson('error', 'An app with this slug already exists.');
    }
    sendJson('error', 'Database error adding app.');
}
?>
