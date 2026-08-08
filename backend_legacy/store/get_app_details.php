<?php
// backend/store/get_app_details.php
require_once '../config.php';

$slug = $_GET['slug'] ?? '';

if (empty($slug)) {
    sendJson('error', 'App slug is required.');
}

try {
    // 1. Fetch Core App Details & Latest Version
    $stmt = $pdo->prepare("
        SELECT a.id, a.slug, a.name, a.developer, a.short_description, a.description, a.features, 
               a.package_name, a.os, a.license, a.icon_url, a.banner_url, a.official_website, a.updated_at,
               v.version_number, v.changelog, v.architecture, v.file_size_bytes, v.min_os_requirement,
               v.sha256_hash, v.md5_hash, v.primary_download_url, v.mirror_download_url, v.official_store_url, 
               v.downloads_count, v.release_date,
               (SELECT IFNULL(AVG(rating), 0) FROM store_reviews r WHERE r.app_id = a.id) as avg_rating,
               (SELECT COUNT(id) FROM store_reviews r WHERE r.app_id = a.id) as review_count
        FROM store_apps a
        LEFT JOIN store_app_versions v ON a.id = v.app_id AND v.is_latest = 1
        WHERE a.slug = ? AND a.status = 'Published'
    ");
    $stmt->execute([$slug]);
    $app = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$app) {
        sendJson('error', 'App not found.');
    }

    $appId = $app['id'];

    // 2. Fetch Screenshots
    $imgStmt = $pdo->prepare("SELECT image_url FROM store_screenshots WHERE app_id = ? ORDER BY display_order ASC");
    $imgStmt->execute([$appId]);
    $app['screenshots'] = $imgStmt->fetchAll(PDO::FETCH_COLUMN);

    // 3. Fetch Categories
    $catStmt = $pdo->prepare("
        SELECT c.name, c.slug 
        FROM store_categories c
        JOIN store_app_categories ac ON c.id = ac.category_id
        WHERE ac.app_id = ?
    ");
    $catStmt->execute([$appId]);
    $app['categories'] = $catStmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Fetch Previous Versions
    $verStmt = $pdo->prepare("
        SELECT version_number, release_date, primary_download_url 
        FROM store_app_versions 
        WHERE app_id = ? AND is_latest = 0 
        ORDER BY release_date DESC LIMIT 5
    ");
    $verStmt->execute([$appId]);
    $app['previous_versions'] = $verStmt->fetchAll(PDO::FETCH_ASSOC);

    sendJson('success', 'App details retrieved', $app);

} catch (PDOException $e) {
    sendJson('error', 'Database error retrieving app details.');
}
?>
