"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/realTimeChatHub").build();

document.getElementById("sendButton").disabled = true;

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
            if (response.status === 204) {
                return null;
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (data) {
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