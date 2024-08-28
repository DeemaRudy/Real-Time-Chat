"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/realTimeChatHub").build();

//Disable the send button until connection is established.
document.getElementById("sendButton").disabled = true;

//connection.on("ReceiveMessage", function (user, message) {
//    var li = document.createElement("li");
//    document.getElementById("messagesList").appendChild(li);
//    // We can assign user-supplied strings to an element's textContent because it
//    // is not interpreted as markup. If you're assigning in any other way, you
//    // should be aware of possible script injection concerns.
//    li.textContent = `${user} says ${message}`;
//});
connection.on("ReceiveMessage", (user, message) => addMessageToMessageList(user, message));

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
    var user = document.getElementById("userNameInput").value;
    var message = document.getElementById("messageInput").value;
    connection.invoke("SendMessage", user, message).catch(function (err) {
        return console.error(err.toString());
    });
    sendMessage(user, message);
    event.preventDefault();

});

loadRecords();

function loadRecords() {
    fetch('Chat/GetLastTenRecords')
        .then(response => {
            if (response.status === 204) { // Якщо немає контенту
                //document.getElementById('messagesList').innerHTML = 'No records found.';
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data) {
                let container = document.getElementById('messagesList');
                container.innerHTML = ''; // Очищуємо контейнер перед додаванням нових записів
                data.forEach(record => {
                    addMessageToMessageList(record.userName, record.message);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching records:', error);
        });
}

function addMessageToMessageList(userName, message) {

    let li = document.createElement("li");
    var messageList = document.getElementById("messagesList");
    messageList.appendChild(li);
    li.textContent = `${userName} says ${message}`;
    if (messageList.children.length > 10) {
        messageList.removeChild(messageList.firstChild);
    }
}

function sendMessage(userName, message) {
    fetch('Chat/AddMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userName: userName, message: message })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.Success) {
            console.error('Failed to send message');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}