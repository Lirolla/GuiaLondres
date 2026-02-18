<?php
require_once 'db.php';

$conn = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM banners ORDER BY order_index ASC";
    $result = $conn->query($sql);
    
    $banners = [];
    while ($row = $result->fetch_assoc()) {
        $banners[] = $row;
    }
    
    jsonResponse($banners);
}

$conn->close();
?>
