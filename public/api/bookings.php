<?php
require_once 'db.php';

$conn = getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $stmt = $conn->prepare("INSERT INTO bookings (client_name, client_email, client_phone, booking_date, booking_time, status, payment_status) VALUES (?, ?, ?, ?, ?, 'pending', 'pending')");
    $stmt->bind_param("sssss", 
        $data['client_name'],
        $data['client_email'],
        $data['client_phone'],
        $data['booking_date'],
        $data['booking_time']
    );
    
    if ($stmt->execute()) {
        jsonResponse(['success' => true, 'booking_id' => $conn->insert_id]);
    } else {
        jsonResponse(['error' => 'Failed to create booking'], 500);
    }
}

$conn->close();
?>
