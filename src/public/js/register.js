const socketLogin = io();

const email = document.querySelector('#email');
const name = document.querySelector('#name');
const password = document.querySelector('#password');
const formRegister = document.querySelector('.form-register');

formRegister.addEventListener('submit', (e) => {
    e.preventDefault();

    //Realizamos las validaciones

    const userDefault = email.value.slice(0, email.value.search('@'));

    const user = {
        name : name.value,
        email: email.value,
        user : userDefault,
        password : password.value,
        lastname : null,
        age : null,
        avatar : null,
    }

    // sessionStorage.setItem('userActive', JSON.stringify(user))
    // location.replace('products.html');
    sendData(user)
})

async function sendData(userData) {
    const data = await fetch('http://localhost:4000/autentication/register', {
        method:'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
    })
    const resp = await data.json();
    if (resp.status === "success") {
        location.replace('products.html');
    }
    clearInputs();
}

function clearInputs () {
    user.value = "";
    password.value= "";
}