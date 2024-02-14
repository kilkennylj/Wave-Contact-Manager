<?php

$inData = getRequestInfo();

// Extracting data from the input
$id = $inData["ID"];
$firstName = $inData["FirstName"];
$lastName = $inData["LastName"];
$phoneNumber = $inData["Phone"];
$emailAddress = $inData["Email"];

// Create connection
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check connection
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
} else {
    // Update query
    $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE ID = ?");
    
    // Bind parameters
    $stmt->bind_param("ssisi", $firstName, $lastName, $phoneNumber, $emailAddress, $id);
    
    // Execute query
    $stmt->execute();
    
    // Close statement and connection
    $stmt->close();
    $conn->close();
    
    // Return success
    returnWithError("");
}

// Function to get request information
function getRequestInfo()
{
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send result information as JSON
function sendResultInfoAsJson($obj)
{
    header('Content-type: application/json');
    echo $obj;
}

// Function to return an error
function returnWithError($err)
{
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}
?>
