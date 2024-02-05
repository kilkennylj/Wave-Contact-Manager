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

function createRow()
{
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td class="fName" id="fName" contenteditable="true">First Name</td>
            <td class="lName" id="lName" contenteditable="true">Last Name</td>
            <td class="phone" id="phone" contenteditable="true">Phone</td>
            <td class="email" id="email" contenteditable="true">Email</td>
            <td class="button" id="button" type="button">
                <button class="editBtn" id="saveBtn">Save</button>
                <button class="delBtn" id="delBtn" onclick="deleteRow(this)">Delete</button>
            </td> 
        `;
        document.getElementById("tableBody").appendChild(newRow);
}

function deleteRow(button)
{
    button.closest("tr").remove();
}