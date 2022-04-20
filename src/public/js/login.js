const socketLogin = io();

const username = document.querySelector('.username');
const email = document.querySelector('.email');
const password = document.querySelector('.password');
const name = document.querySelector('.name');
const lastname = document.querySelector('.lastname');
const age = document.querySelector('.age');
const avatar = document.querySelector('.avatar');

const formLogin = document.querySelector('.form-login');
// const messageErrorUser = document.querySelector('.message-error-user');
// const messageErrorEmail = document.querySelector('.message-error-email');

formLogin.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!username.value.trim() || username.value.trim().length < 3 || !email.value) {
        // messageErrorUser.textContent = 'Campo Requerido';
        // username.classList.add('border-red-500', 'placeholder-red-500')
        // messageErrorEmail.textContent = 'Campo Requerido';
        // email.classList.add('border-red-500', 'placeholder-red-500')
        return
    }
    // messageErrorUser.textContent = ''
    // username.classList.remove('border-red-500', 'placeholder-red-500')
    // messageErrorEmail.textContent = ''
    // email.classList.remove('border-red-500', 'placeholder-red-500');

    const user = {
        id: email.value,
        user : username.value,
        name : name.value,
        lastname : lastname.value,
        age : age.value,
        avatar : avatar.value,
    }

    socketLogin.emit('user', {
        email: email.value,
        user : username.value,
    });

    sessionStorage.setItem('userActive', JSON.stringify(user))
    location.replace('products.html');
    sendData(user)
})

async function sendData(userData) {
    const data = await fetch('http://localhost:4000/autentication/login', {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
    })
    const resp = await data.json();
    if (resp.status === "success") {
        location.replace('products.html');
    }else{
        console.log("first")
    }
    clearInputs();
}

function clearInputs () {
    user.value = "";
    password.value= "";
}