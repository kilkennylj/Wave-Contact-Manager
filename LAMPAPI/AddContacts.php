<?php
	$inData = getRequestInfo();
	
  	$firstName = $inData["FirstName"];
  	$lastName = $inData["LastName"];
  	$phoneNumber = $inData["Phone"];
  	$emailAddress = $inData["Email"];
  	$userId = $inData["UserID"];


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$sql = "SELECT * FROM Contacts WHERE UserID = ? AND Phone = ? or Email = ?";
		$stmt = $conn->prepare($sql);
		$stmt->bind_param("sss", $userId, $phoneNumber, $emailAddress);
		$stmt->execute();
		$result = $stmt->get_result();
		$rows = mysqli_num_rows($result):

		if($rows == 0){
			$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
			$stmt->bind_param("ssssi", $firstName, $lastName, $phoneNumber, $emailAddress, $userId);
			$stmt->execute();
			
			if($result->getresult()){
				returnWithInfo("Successfully Added Contact");
			}else{
				returnWithError("Failed to Add Contact");
			}

			$stmt->close();
			$conn->close();
		}else{
			returnWithError("Phone or Email already added to Contacts");
		}
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
