<?php
	$inData = getRequestInfo();
	
  	$firstName = $inData["firstName"];
  	$lastName = $inData["lastName"];
  	$phoneNumber = $inData["phone"];
  	$emailAddress = $inData["email"];
  	$userId = $inData["userID"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("ssisi", $firstName, $lastName, $phoneNumber, $emailAddress, $userId);
		$stmt->execute();

		$ID = $stmt->insert_id;
		
		$stmt->close();
		$conn->close();
		returnWithID($ID);
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

	function returnWithID( $ID )
	{
		$retValue = '{"ID" :"' . $ID . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>
