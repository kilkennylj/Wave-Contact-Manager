const urlBase = 'http://cop4331-33.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doRegister()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let fname = document.getElementById("fname").value;
	let lname = document.getElementById("lname").value;
	let uname = document.getElementById("uname").value;
	let pword = document.getElementById("pword").value;
	
	document.getElementById("registerresult").innerHTML = "";

	let tmp = {fname:fname,lname:lname,uname:uname,pword:pword};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;
	console.log("Sending registration data from "+uname+" to "+url);

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
		
				// firstName = jsonObject.firstName;
				// lastName = jsonObject.lastName;
	
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