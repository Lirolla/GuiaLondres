<?php
require_once 'db.php';

$conn = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    
    if ($category) {
        $stmt = $conn->prepare("SELECT * FROM videos WHERE category = ? ORDER BY id DESC");
        $stmt->bind_param("s", $category);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query("SELECT * FROM videos ORDER BY id DESC");
    }
    
    $videos = [];
    while ($row = $result->fetch_assoc()) {
        $videos[] = $row;
    }
    
    jsonResponse($videos);
}

$conn->close();
?>
