<?php
// backend/store/get_apps.php
require_once '../config.php';

// Allows fetching all apps or filtering by OS, Category, or Search Query
$os = $_GET['os'] ?? '';
$search = $_GET['q'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

try {
    $query = "
        SELECT a.slug, a.name, a.developer, a.short_description, a.os, a.license, a.icon_url,
               v.version_number, v.architecture, v.file_size_bytes, v.downloads_count,
               (SELECT IFNULL(AVG(rating), 0) FROM store_reviews r WHERE r.app_id = a.id) as avg_rating
        FROM store_apps a
        LEFT JOIN store_app_versions v ON a.id = v.app_id AND v.is_latest = 1
        WHERE a.status = 'Published'
    ";
    
    $params = [];
    
    if (!empty($os)) {
        $query .= " AND a.os = ?";
        $params[] = $os;
    }
    
    if (!empty($search)) {
        $query .= " AND (a.name LIKE ? OR a.developer LIKE ? OR a.short_description LIKE ?)";
        $searchTerm = "%" . $search . "%";
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $query .= " ORDER BY v.downloads_count DESC LIMIT ? OFFSET ?";
    
    // PDO doesn't like limit/offset in array execute well, bind manually
    $stmt = $pdo->prepare($query);
    
    $paramIndex = 1;
    if (!empty($os)) {
        $stmt->bindValue($paramIndex++, $os, PDO::PARAM_STR);
    }
    if (!empty($search)) {
        $stmt->bindValue($paramIndex++, $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue($paramIndex++, $searchTerm, PDO::PARAM_STR);
        $stmt->bindValue($paramIndex++, $searchTerm, PDO::PARAM_STR);
    }
    $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
    $stmt->bindValue($paramIndex, $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $apps = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendJson('success', 'Apps retrieved', $apps);
} catch (PDOException $e) {
    sendJson('error', 'Database error retrieving apps');
}
?>
