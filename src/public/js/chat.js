const socketChat = io();

const messageChat = document.querySelector('.chat-message');
const formChat = document.querySelector('.form-chat');

formChat.addEventListener('submit' , (e) => {
    e.preventDefault();
    if (messageChat.value.trim() === "") return
    console.log(socketChat)
})