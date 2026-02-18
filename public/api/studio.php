<?php
require_once 'db.php';

$conn = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM studio_config LIMIT 1");
    $config = $result->fetch_assoc();
    
    jsonResponse($config ? $config : []);
}

$conn->close();
?>
