const urlBase = 'http://cop4331-33.xyz/LAMPAPI';
const extension = 'php';

let userId = 0;
var passwordInput = document.getElementById("pword");
var passwordRequireItems = document.getElementsByClassName("password-require-item");
var satisfy = 0;
	
passwordInput.onkeyup = function()
{
	// Check uppercase
	let uppercaseRegex = /[A-Z]/g;
	if (passwordInput.value.match(uppercaseRegex))
	{
		passwordRequireItems[0].classList.remove("invalid");
		passwordRequireItems[0].classList.add("valid");
	}
	else
	{
		passwordRequireItems[0].classList.remove("valid");
		passwordRequireItems[0].classList.add("invalid");
	}
	
	// Check lowercase
	let lowercaseRegex = /[a-z]/g;
	if (passwordInput.value.match(lowercaseRegex))
	{
		passwordRequireItems[1].classList.remove("invalid");
		passwordRequireItems[1].classList.add("valid");
	}
	else
	{
		passwordRequireItems[1].classList.remove("valid");
		passwordRequireItems[1].classList.add("invalid");
	}

	// Check number
	let numbersRegex = /[0-9]/g;
	if (passwordInput.value.match(numbersRegex))
	{
		passwordRequireItems[2].classList.remove("invalid");
		passwordRequireItems[2].classList.add("valid");
	}
	else
	{
		passwordRequireItems[2].classList.remove("valid");
		passwordRequireItems[2].classList.add("invalid");
	}

	// Check special
	let specialRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g;
	if (passwordInput.value.match(specialRegex))
	{
		passwordRequireItems[3].classList.remove("invalid");
		passwordRequireItems[3].classList.add("valid");
	}
	else
	{
		passwordRequireItems[3].classList.remove("valid");
		passwordRequireItems[3].classList.add("invalid");
	}

	// Check length
	if (passwordInput.value.length >= 8)
	{
		passwordRequireItems[4].classList.remove("invalid");
		passwordRequireItems[4].classList.add("valid");
	}
	else
	{
		passwordRequireItems[4].classList.remove("valid");
		passwordRequireItems[4].classList.add("invalid");
	}
}

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

function doValidate()
{
	if(document.getElementById("fname").value != "" &&
	document.getElementById("lname").value != "" &&
	document.getElementById("uname").value != "" &&
	document.getElementById("pword").value != "" &&
	passwordRequireItems[0].classList.contains("valid") &&
	passwordRequireItems[1].classList.contains("valid") &&
	passwordRequireItems[2].classList.contains("valid") &&
	passwordRequireItems[3].classList.contains("valid") &&
	passwordRequireItems[4].classList.contains("valid"))
	{
		doRegister();
	}
}