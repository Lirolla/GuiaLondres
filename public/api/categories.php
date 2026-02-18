<?php
require_once 'db.php';
$conn = getConnection();
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM categories ORDER BY id ASC");
    $categories = [];
    while ($row = $result->fetch_assoc()) {
        $categories[] = $row;
    }
    jsonResponse($categories);
}
$conn->close();
?>
