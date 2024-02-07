<?php

	$inData = getRequestInfo();

	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$userID = $inData["userID"];

	// Create connection
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 
	// Check connection
	if ($conn->connect_error)
	{
	    returnWithError( $conn->connect_error );
	}

	else
	{
	    $stmt = $conn->prepare("DELETE FROM Contacts WHERE firstName = ? and lastName = ? and userID = ?");
    	$stmt->bind_param("ssi", $firstName, $lastName, $userID);
	    $stmt->execute();
	    $stmt->close();
	    $conn->close();
	    returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
  		sendResultInfoAsJson( $retValue );
	}

?>
