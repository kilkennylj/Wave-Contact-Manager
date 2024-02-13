const urlBase = 'http://cop4331-33.xyz/LAMPAPI';
const extension = 'php';

let UserID_Global = 0;

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
                UserID_Global = jsonObject.id;

                if(UserID_Global < 1)
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
                <button class="saveBtn" id="saveBtn" onclick="saveUser(this, 'SaveNew')">Save</button>
                <button class="cancelBtn" id="cancelBtn" onclick="cancelEdit(this, 'CancelNew')">Cancel</button>
            </td> 
        `;
        document.getElementById("tableBody").appendChild(newRow);
}

function getContactID(LastName)
{
    let UserId = UserID_Global;
    let Search = LastName;
    let url = urlBase + "/SearchContacts." + extension;

    let tmp = {UserId : UserId, Search : Search};
    let jsonPayload = JSON.stringify(tmp);

    let xhr = new XMLHttpRequest("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    let contactID;
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                contactID = jsonObject[0].ID;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        console.log(err);
    }

    return contactID;
}

function saveUser(button, request)
{
    let thisRow = button.closest("tr");
    let tableCells = thisRow.getElementsByTagName("td");
    let FirstName = tableCells[0].innerText;  //Get value of columns
    let LastName = tableCells[1].innerText;
    let Phone = tableCells[2].innerText;
    let Email = tableCells[3].innerText;

    let url;
    let tmp;
    //Saving edits to existing user
    if(request === "SaveEdit")
    {
        url = urlBase + "/UpdateContacts." + extension;
        let ID = parseInt(getContactID(LastName));
        tmp = {
            FirstName:FirstName,
            LastName:LastName,
            Phone:Phone,
            Email:Email,
            ID:ID 
        }
    }
    else if(request === "SaveNew")
    {
        url = urlBase + "/AddContacts." + extension;
        let UserID = UserID_Global;
        tmp = {
            FirstName:FirstName,
            LastName:LastName,
            Phone:Phone,
            Email:Email,
            UserID:UserID 
        }
    }
    else
    {
        console.log("HTML ERROR: Invalid or No request given to save function");
        return;
    }

    let jsonPayload = JSON.stringify(tmp);
    let xhr = new XMLHttpRequest("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                thisRow.innerHTML = `
                <td class="fName" id="fName">`+FirstName+`</td>
                <td class="lName" id="lName">`+LastName+`</td>
                <td class="phone" id="phone">`+Phone+`</td>
                <td class="email" id="email">`+Email+`</td>
                <td class="button" id="button" type="button">
                    <button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
                    <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>
                </td> 
                `;
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        console.log(err);
    }
}

//Changes text fields to be editable and sets Save button
function editUser(button)
{
    let thisRow = button.closest("tr");
    let tableCells = thisRow.getElementsByTagName("td");
    let FirstName = tableCells[0].innerText;  //Save value of columns
    let LastName = tableCells[1].innerText;
    let Phone = tableCells[2].innerText;
    let Email = tableCells[3].innerText;

    thisRow.innerHTML = `
                    <td class="fName" id="fName" contenteditable="true">`+FirstName+`</td>
                    <td class="lName" id="lName" contenteditable="true">`+LastName+`</td>
                    <td class="phone" id="phone" contenteditable="true">`+Phone+`</td>
                    <td class="email" id="email" contenteditable="true">`+Email+`</td>
                    <td class="button" id="button" type="button">
                        <button class="editBtn" id="editBtn" onclick="saveUser(this, 'SaveEdit')">Save</button>
                        <button class="cancelBtn" id="cancelBtn" onclick="cancelEdit(this, 'CancelExists')">Cancel</button>
                    </td> 
                    `;
}

function deleteUser (button)
{
    let confirmed = window.confirm("Do you want to delete this contact?");
    if(confirmed)
    {
        let thisRow = button.closest("tr");
        let tableCells = thisRow.getElementsByTagName("td");
        let firstName = tableCells[0].innerText;
        let lastName = tableCells[1].innerText;
        let UserID = UserID_Global;

        let tmp = 
        {
            firstName : firstName,
            lastName : lastName,
            UserID : UserID
        }

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + "/DeleteContacts." + extension;
        let xhr = new XMLHttpRequest("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try
        {
            xhr.onreadystatechange = function()
            {
                if (this.readyState == 4 && this.status == 200)
                {
                    deleteRow(button);
                }
            };
            xhr.send(jsonPayload);
        }
        catch(err)
        {
            console.log(err);
        }
    }
    else
    {
        console.log("Deletion canceled.");
    }
}

function deleteRow(button)
{
    button.closest("tr").remove();
}

function cancelEdit(button, request)
{
    let thisRow = button.closest("tr");
    if(request === "CancelNew")
    {
        thisRow.remove();
    }
    else if(request === "CancelExists")
    {
        let tableCells = thisRow.getElementsByTagName("td");
        let FirstName = tableCells[0].innerText;  //Save value of columns
        let LastName = tableCells[1].innerText;
        let Phone = tableCells[2].innerText;
        let Email = tableCells[3].innerText;
        thisRow.innerHTML = `
                <td class="fName" id="fName">`+FirstName+`</td>
                <td class="lName" id="lName">`+LastName+`</td>
                <td class="phone" id="phone">`+Phone+`</td>
                <td class="email" id="email">`+Email+`</td>
                <td class="button" id="button" type="button">
                    <button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
                    <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>
                </td> 
                `;
    }
    else
    {
        console.log("HTML ERROR: Invalid or no request given to function");
    }
}

function searchContacts()
{
    let Search = document.getElementById("searchQuery").value;
    let UserID = UserID_Global;

    let tmp = {UserId : UserId, Search : Search};
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try
    {
        xhr.onreadystatechange = function()
        {
            if(this.readyState == 4 && this.status == 200)
            {
                let jsonObject = JSON.parse(xhr.responseText);
                updateTable(jsonObject);
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        console.log(err);
    }
}

function updateTable(data)
{
    let table = document.getElementById("contactTable");
    let tbody = table.getElementsByTagName("tbody");
    tbody.innerHTML = ""; //Clear table

    data.array.forEach(item => {
        let row = document.createElement("tr");
        let keys = Object.keys(item);
        for(var i = 0; i < keys.length - 1; i++)
        {
            let cell = document.createElement("td");
            cell.textContent = item[keys[i]];
            row.appendChild(cell);
        }
        let buttonCell = document.createElement("td");
        buttonCell.innerHTML = `<button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
            <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>`;
        row.appendChild(buttonCell);
        tableBody.appendChild(row);
    });
}

function logout()
{
    UserID_Global = 0;
    window.location.href = "index.html"
}
