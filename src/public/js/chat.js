const socketChat = io();

const messageChat = document.querySelector('.chat-message');
const formChat = document.querySelector('.form-chat');
const containerMessages = document.querySelector('.container-messages');
const containerUsers = document.querySelector('.container-users');

let user = "";

document.addEventListener('DOMContentLoaded' , () => {
    user = sessionStorage.getItem('userActive');
    if (!user) location.replace('/');
})

formChat.addEventListener('submit' , (e) => {
    e.preventDefault();
    if (messageChat.value.trim() === "") return
    
    const hoy = new Date();
    let hours = hoy.getHours();
    const date = `${hours === 0 ? 12 : hours}:${hoy.getMinutes()} ${hours >= 12 ? 'PM' : 'AM'}`;

    const objMessage = {
        id : socketChat.id,
        message : messageChat.value.trim(),
        timestamp : date,
        user
    }

    socketChat.emit('message',objMessage);
    messageChat.value = "";
})

socketChat.on('users-login', async users => {

    const response = await fetch('./templates/users-chat.handlebars');
    const data = await response.text();

    const processedtemplate = Handlebars.compile(data);
    const html = processedtemplate({users})
    containerUsers.innerHTML = html;
})

socketChat.on('data-messages', async (messages) => {
    const response = await fetch('./templates/message-chat.handlebars');
    const data = await response.text();
    
    const processedtemplate = Handlebars.compile(data);
    const html = processedtemplate({messages})
    containerMessages.innerHTML = html;
})