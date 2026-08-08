<?php
// backend/user/upload.php
require_once '../auth/session.php';
requireLogin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJson('error', 'Invalid request method.');
}

if (!isset($_FILES['profile_image']) || $_FILES['profile_image']['error'] !== UPLOAD_ERR_OK) {
    sendJson('error', 'No file uploaded or upload error.');
}

$file = $_FILES['profile_image'];
$maxSize = 2 * 1024 * 1024; // 2MB

if ($file['size'] > $maxSize) {
    sendJson('error', 'File size exceeds 2MB limit.');
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
$mimeType = mime_content_type($file['tmp_name']);

if (!in_array($mimeType, $allowedTypes)) {
    sendJson('error', 'Invalid file type. Only JPG, PNG, and WEBP are allowed.');
}

// Generate unique filename
$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = $_SESSION['uuid'] . '_' . time() . '.' . $ext;
$uploadPath = '../../uploads/' . $filename; // Relative to script

// Compress and Resize using GD
list($width, $height) = getimagesize($file['tmp_name']);
$newSize = 256; // Fixed square size for profile pic

$src = null;
if ($mimeType === 'image/jpeg') $src = imagecreatefromjpeg($file['tmp_name']);
elseif ($mimeType === 'image/png') $src = imagecreatefrompng($file['tmp_name']);
elseif ($mimeType === 'image/webp') $src = imagecreatefromwebp($file['tmp_name']);

if (!$src) {
    sendJson('error', 'Failed to process image.');
}

$dst = imagecreatetruecolor($newSize, $newSize);
// Handle transparency for PNG/WEBP
imagealphablending($dst, false);
imagesavealpha($dst, true);
$transparent = imagecolorallocatealpha($dst, 255, 255, 255, 127);
imagefilledrectangle($dst, 0, 0, $newSize, $newSize, $transparent);

// Crop to square and resize
$minDim = min($width, $height);
$srcX = ($width - $minDim) / 2;
$srcY = ($height - $minDim) / 2;

imagecopyresampled($dst, $src, 0, 0, $srcX, $srcY, $newSize, $newSize, $minDim, $minDim);

// Save compressed image
$saveSuccess = false;
if ($mimeType === 'image/jpeg') $saveSuccess = imagejpeg($dst, $uploadPath, 85);
elseif ($mimeType === 'image/png') $saveSuccess = imagepng($dst, $uploadPath, 8);
elseif ($mimeType === 'image/webp') $saveSuccess = imagewebp($dst, $uploadPath, 85);

imagedestroy($src);
imagedestroy($dst);

if (!$saveSuccess) {
    sendJson('error', 'Failed to save uploaded image.');
}

// Delete old image if exists
$user = getCurrentUser($pdo);
if ($user && $user['profile_picture']) {
    $oldFile = '../../uploads/' . basename($user['profile_picture']);
    if (file_exists($oldFile)) unlink($oldFile);
}

// Update DB
$publicUrl = 'uploads/' . $filename;
try {
    $stmt = $pdo->prepare("UPDATE users SET profile_picture = ? WHERE id = ?");
    $stmt->execute([$publicUrl, $_SESSION['user_id']]);
    sendJson('success', 'Profile picture updated successfully.', ['profile_picture' => $publicUrl]);
} catch (PDOException $e) {
    sendJson('error', 'Database error updating profile picture.');
}
?>
