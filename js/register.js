const urlBase = 'http://cop4331-33.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;

function doRegister()
{
	let firstName = document.getElementById("fname").value;
	let lastName = document.getElementById("lname").value;
	let login = document.getElementById("uname").value;
	let password = document.getElementById("pword").value;
	
	document.getElementById("registerresult").innerHTML = "";

	let tmp = {firstName:firstName,lastName:lastName,login:login,password:password};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;
	console.log("Sending registration data from "+login+" to "+url);

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("registerresult").innerHTML = "User account already exists";
					return;
				}
	
				window.location.href = "index.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerresult").innerHTML = err.message;
	}
}