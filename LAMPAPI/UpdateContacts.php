<?php

$inData = getRequestInfo();

$id = $inData["id"];
// Additional parameters for update
$name = $inData["name"];
$email = $inData["email"];
// Add other fields as needed

// Create connection
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
// Check connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Update query
    $stmt = $conn->prepare("UPDATE Contacts SET Name=?, Email=? WHERE ID = ?");
    $stmt->bind_param("ssi", $name, $email, $id);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    returnWithError("");
}

function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
