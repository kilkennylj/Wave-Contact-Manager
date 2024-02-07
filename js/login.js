const urlBase = 'http://cop4331-33.xyz/LAMPAPI';
const extension = 'php';

let userId=0;
let userName='';

function doLogin() {
    
    document.getElementById("loginResult").innerHTML = "Logging in...";

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let tmp = {login:login, password:password};

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/Login." + extension;
    console.log("sending login request from "+login+ " to "+url);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if(userId < 1)
                {
                    document.getElementById("loginResult").innerHTML = "Incorrect password or user";
                    return;
                }

                window.location.href = "landing.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function sendToRegister() {
    window.location.href = "register.html";
}

// Separate into a new file when done. Need to work out ID first

function createRow()
{
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td class="fName" id="fName" contenteditable="true">First Name</td>
            <td class="lName" id="lName" contenteditable="true">Last Name</td>
            <td class="phone" id="phone" contenteditable="true">Phone</td>
            <td class="email" id="email" contenteditable="true">Email</td>
            <td class="button" id="button" type="button">
                <button class="saveBtn" id="saveBtn" onclick="saveUser(this)>Save</button>
                <button class="delBtn" id="delBtn" onclick="deleteRow(this)">Delete</button>
            </td> 
        `;
        document.getElementById("tableBody").appendChild(newRow);
}

function deleteRow(button)
{
    button.closest("tr").remove();
}

function saveUser(button)
{
    let thisRow = button.closest("tr");
    let FirstName = thisRow.getElementById("fName").value;  //Get value from the columns
    let LastName = thisRow.getElementById("lName").value;
    let Phone = thisRow.getElementById("phone").value;
    let Email = thisRow.getElementById("email").value;
    let UserID = userId; //Set on login. Might not work needs fixing/testing

    //Preparing for API

    let tmp = {
        FirstName:FirstName,
        LastName:LastName,
        Phone:Phone,
        Email:Email,
        UserID:UserID //Testing needs to be done here, not sure if it works
    }

    let jsonPayload = JSON.stringify(tmp);

    //IF add,
    
    //ELSE IF edit

    //ELSE error


}