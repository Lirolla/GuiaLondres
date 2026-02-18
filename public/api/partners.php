<?php
require_once 'db.php';

$conn = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM partners ORDER BY id DESC";
    $result = $conn->query($sql);
    
    $partners = [];
    while ($row = $result->fetch_assoc()) {
        $partners[] = $row;
    }
    
    jsonResponse($partners);
}

$conn->close();
?>
