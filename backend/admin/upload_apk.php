<?php
// backend/admin/upload_apk.php
require_once '../auth/session.php';
requireLogin();

if ($_SESSION['role'] !== 'Admin') {
    sendJson('error', 'Admin privileges required.');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

if (!isset($_FILES['apk_file']) || $_FILES['apk_file']['error'] !== UPLOAD_ERR_OK) {
    sendJson('error', 'No file uploaded or upload error.');
}

$file = $_FILES['apk_file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Accept apk, exe, etc
if (!in_array($ext, ['apk', 'exe', 'zip'])) {
    sendJson('error', 'Only APK, EXE, or ZIP files are allowed.');
}

// Generate unique filename
$filename = uniqid('app_') . '.' . $ext;
$uploadPath = '../../uploads/apks/' . $filename; 

if (move_uploaded_file($file['tmp_name'], $uploadPath)) {
    $publicUrl = 'uploads/apks/' . $filename;
    sendJson('success', 'File uploaded successfully.', ['url' => $publicUrl]);
} else {
    sendJson('error', 'Failed to save the uploaded file to server.');
}
?>
