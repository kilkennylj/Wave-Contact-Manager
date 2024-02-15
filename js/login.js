const urlBase = 'http://cop4331-33.xyz/LAMPAPI';
const extension = 'php';

let UserID_Global;

let cookies = document.cookie.split(";");
for(let cookie of cookies) {
    let parts = cookie.split("=");
    if (parts[0].trim() === "userID_Global") {
        UserID_Global = parts[1];
        break;
    }
}

function doLogin() {

    UserID_Global = 0;

    document.getElementById("loginResult").innerHTML = "Logging in...";

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let tmp = { login: login, password: password };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + "/Login." + extension;
    console.log("sending login request from " + login + " to " + url);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                UserID_Global = jsonObject.id;

                if (UserID_Global < 1) {
                    document.getElementById("loginResult").innerHTML = "Incorrect password or user";
                    return;
                }

                saveCookie();

                window.location.href = "landing.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

function sendToRegister() {
    window.location.href = "register.html";
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "userID_Global=" + UserID_Global + ";expires=" + date.toGMTString() + ";path=/; cop4331-33.xyz";
}

// Separate into a new file when done. Need to work out ID first

function createRow() {
    let newRow = document.createElement('tr');
    newRow.innerHTML = `
            <td class="fName" id="fName" contenteditable="true" style="color:#746F72;font-style:italic">First Name</td>
            <td class="lName" id="lName" contenteditable="true" style="color:#746F72;font-style:italic">Last Name</td>
            <td class="phone" id="phone" contenteditable="true" style="color:#746F72;font-style:italic">Phone</td>
            <td class="email" id="email" contenteditable="true" style="color:#746F72;font-style:italic">Email</td>
            <td class="button" id="button" type="button">
                <button class="waveBtn" id="waveBtn" onclick="waveUser(this)">👋</button>
                <button class="saveBtn" id="saveBtn" onclick="saveUser(this)">Save</button>
                <button class="cancelBtn" id="cancelBtn" onclick="cancelEdit(this, 'CancelNew')">Cancel</button>
            </td> 
        `;
    document.getElementById("tableBody").appendChild(newRow);
}

// function getContactID(LastName) {
//     let UserId = UserID_Global;
//     let Search = LastName;
//     let url = urlBase + "/SearchContacts." + extension;

//     let tmp = { UserId: UserId, Search: Search };
//     let jsonPayload = JSON.stringify(tmp);

//     let xhr = new XMLHttpRequest("POST", url, true);
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
//     let contactID;
//     try {
//         xhr.onreadystatechange = function () {
//             if (this.readyState == 4 && this.status == 200) {
//                 let jsonObject = JSON.parse(xhr.responseText);
//                 contactID = jsonObject.results[0]["ID"];
//             }
//         };
//         xhr.send(jsonPayload);
//     }
//     catch (err) {
//         console.log(err);
//     }

//     return contactID;
// }

function saveEdit(button)
{
    let thisRow = button.closest("tr");
    let tableCells = thisRow.getElementsByTagName("td");
    let firstName = tableCells[0].innerText;  //Get value of columns
    let lastName = tableCells[1].innerText;
    let phone = tableCells[2].innerText;
    let email = tableCells[3].innerText;
    let ID = tableCells[4].innerText;

    let url = urlBase + "/UpdateContacts." + extension;
    let tmp = {
        ID: ID,
        FirstName: firstName,
        LastName: lastName,
        Phone: phone,
        Email: email
    }

    let jsonPayload = JSON.stringify(tmp);
    let xhr = new XMLHttpRequest("POST", url, true);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                thisRow.innerHTML = `
                <td class="fName" id="fName">`+ firstName + `</td>
                <td class="lName" id="lName">`+ lastName + `</td>
                <td class="phone" id="phone">`+ phone + `</td>
                <td class="email" id="email">`+ email + `</td>
                <td class="ID" id="ID" style="display:none">`+ ID + `</td>
                <td class="button" id="button" type="button">
                    <button class="waveBtn" id="waveBtn" onclick="waveUser(this)">👋</button>
                    <button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
                    <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>
                </td> 
                `;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log(err);
    }
}

function saveUser(button) {
    let thisRow = button.closest("tr");
    let tableCells = thisRow.getElementsByTagName("td");
    let firstName = tableCells[0].innerText;  //Get value of columns
    let lastName = tableCells[1].innerText;
    let phone = tableCells[2].innerText;
    let email = tableCells[3].innerText;
    let ID;

    let url = urlBase + "/AddContacts." + extension;
    let userID= UserID_Global;
    let tmp = {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        email: email,
        userID: userID
    }
    
    let jsonPayload = JSON.stringify(tmp);
    let xhr = new XMLHttpRequest("POST", url, true);
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                //GET CONTACT ID FROM RETURN
                let jsonObject = JSON.parse(xhr.responseText);
                ID = jsonObject.ID;
                
                thisRow.innerHTML = `
                <td class="fName" id="fName">`+ firstName + `</td>
                <td class="lName" id="lName">`+ lastName + `</td>
                <td class="phone" id="phone">`+ phone + `</td>
                <td class="email" id="email">`+ email + `</td>
                <td class="ID" id="ID" style="display:none">`+ ID + `</td>
                <td class="button" id="button" type="button">
                    <button class="waveBtn" id="waveBtn" onclick="waveUser(this)">👋</button>
                    <button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
                    <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>
                </td> 
                `;
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log(err);
    }
}

//Changes text fields to be editable and sets Save button
function editUser(button) {
    let thisRow = button.closest("tr");
    let tableCells = thisRow.getElementsByTagName("td");
    let FirstName = tableCells[0].innerText;  //Save value of columns
    let LastName = tableCells[1].innerText;
    let Phone = tableCells[2].innerText;
    let Email = tableCells[3].innerText;
    let ID = tableCells[4].innerText;

    thisRow.innerHTML = `
                    <td class="fName" id="fName" contenteditable="true" style="color:#746F72;font-style:italic">`+ FirstName + `</td>
                    <td class="lName" id="lName" contenteditable="true" style="color:#746F72;font-style:italic">`+ LastName + `</td>
                    <td class="phone" id="phone" contenteditable="true" style="color:#746F72;font-style:italic">`+ Phone + `</td>
                    <td class="email" id="email" contenteditable="true" style="color:#746F72;font-style:italic">`+ Email + `</td>
                    <td class="ID" id="ID" style="display:none">`+ ID + `</td>
                    <td class="button" id="button" type="button">
                        <button class="waveBtn" id="waveBtn" onclick="waveUser(this)">👋</button>
                        <button class="editBtn" id="editBtn" onclick="saveEdit(this)">Save</button>
                        <button class="cancelBtn" id="cancelBtn" onclick="cancelEdit(this, 'CancelExists')">Cancel</button>
                    </td> 
                    `;
}

function deleteUser(button) {
    let confirmed = window.confirm("Do you want to delete this contact?");
    if (confirmed) {
        let thisRow = button.closest("tr");
        let tableCells = thisRow.getElementsByTagName("td");
        let firstName = tableCells[0].innerText;
        let lastName = tableCells[1].innerText;
        let UserID = UserID_Global;

        let tmp =
        {
            firstName: firstName,
            lastName: lastName,
            UserId: UserID
        }

        let jsonPayload = JSON.stringify(tmp);
        let url = urlBase + "/DeleteContacts." + extension;
        let xhr = new XMLHttpRequest("POST", url, true);
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try {
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    deleteRow(button);
                }
            };
            xhr.send(jsonPayload);
        }
        catch (err) {
            console.log(err);
        }
    }
    else {
        console.log("Deletion canceled.");
    }
}

function deleteRow(button) {
    button.closest("tr").remove();
}

function cancelEdit(button, request) {
    let thisRow = button.closest("tr");
    if (request === "CancelNew") {
        thisRow.remove();
    }
    else if (request === "CancelExists") {
        let tableCells = thisRow.getElementsByTagName("td");
        let FirstName = tableCells[0].innerText;  //Save value of columns
        let LastName = tableCells[1].innerText;
        let Phone = tableCells[2].innerText;
        let Email = tableCells[3].innerText;
        let ID = tableCells[4].innerText;
        thisRow.innerHTML = `
                <td class="fName" id="fName">`+ FirstName + `</td>
                <td class="lName" id="lName">`+ LastName + `</td>
                <td class="phone" id="phone">`+ Phone + `</td>
                <td class="email" id="email">`+ Email + `</td>
                <td class="ID" id="ID" style="display:none">`+ ID + `</td>
                <td class="button" id="button" type="button">
                    <button class="waveBtn" id="waveBtn" onclick="waveUser(this)">👋</button>
                    <button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
                    <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>
                </td> 
                `;
    }
    else {
        console.log("HTML ERROR: Invalid or no request given to function");
    }
}

function searchContacts() {
    let Search = document.getElementById("searchQuery").value;
    let UserID = UserID_Global;

    let tmp = { UserId: UserID, search: Search };
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/SearchContacts.' + extension;
    let xhr = new XMLHttpRequest;
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);
                updateTable(jsonObject);
            }
        };
        xhr.send(jsonPayload);
    }
    catch (err) {
        console.log(err);
    }
}

function updateTable(data) 
{    
    let table = document.getElementById("contactTable");
    let tbody = table.getElementsByTagName("tbody")[0];
    tbody.innerHTML = ""; //Clear table

    for(var i = 0; i < data.results.length; i++)
    {
        let res = data.results[i];
        let row = document.createElement("tr");
        for (var key in res)
        {
            let cell = document.createElement("td");
            if (key === "ID")
            {
                cell.textContent = res[key];
                cell.style.display = "none";
                cell.setAttribute("id", "ID");
                cell.setAttribute("class", "ID");
                row.appendChild(cell);
            } 
            else if(key != "UserID")
            {
                cell.textContent = res[key];
                row.appendChild(cell);
            }  
        }
        let buttonCell = document.createElement("td");
        buttonCell.setAttribute("id", "button");
        buttonCell.setAttribute("class", "button");
        buttonCell.innerHTML = `<button class="waveBtn" id="waveBtn" onclick="waveUser(this)">👋</button>
            <button class="editBtn" id="editBtn" onclick="editUser(this)">Edit</button>
            <button class="delBtn" id="delBtn" onclick="deleteUser(this)">Delete</button>`;
        row.appendChild(buttonCell);
        tbody.appendChild(row);
    }
}


function logout() {
    UserID_Global = 0;
    document.cookie = "UserID_Global = 0; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html"
}

function waveUser(button)
{
    let thisRow = button.closest("tr");
    let tableCells = thisRow.getElementsByTagName("td");
    let toEmail = tableCells[3].innerText;
    window.open("mailto:"+toEmail);
}