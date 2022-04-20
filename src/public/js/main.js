//Socket
const socket = io();

const btnAddProduct = document.querySelector('.btn-add-product');
const nameProduct = document.querySelector('.name-product');
const priceProduct = document.querySelector('.price-product');
const description = document.querySelector('.description-product');
const stock = document.querySelector('.stock-product');
const fileProduct = document.querySelector('.file-product');

const messageName = document.querySelector('.message-error-name');
const messagePrecio = document.querySelector('.message-error-price');
const messageError = document.querySelector('.message-error');

const tableProducts = document.querySelector('.table-products');

document.addEventListener('DOMContentLoaded', () => {
    validateUser();
})

validateInputs();
btnAddProduct.addEventListener('click', validateForm);

async function validateUser() {
    const data = await fetch('http://localhost:4000/autentication/login')
    const resp = await data.json();
    document.querySelector('.nameUser').innerHTML = resp.name
    clearInputs();
}

function validateForm() {
    if (!nameProduct.value.trim() 
        || !priceProduct.value.trim() 
        || !description.value.trim() 
        || !stock.value.trim() 
        || !fileProduct.value
        ) {
        messageError.textContent = "Los campos son obligatorios";
        messageError.classList.remove('hidden')
        setTimeout(() => {
            messageError.classList.add('hidden')
        }, 2000);
        return 
    }

    const formData = new FormData();
    formData.append('file', fileProduct.files[0])
    formData.append('name', nameProduct.value)
    formData.append('price', priceProduct.value);

    const product = {
        name : nameProduct.value,
        price : priceProduct.value,
        description : description.value,
        stock : stock.value,
    }
    socket.emit('sendProduct', product)
    clearInputs();
    console.log(formData)
    sendData(formData);
}


//Sockets de escucha 
socket.on('products', async (products) => {
    const response = await fetch('./templates/table-products.handlebars')
    const data = await response.text();
    
    const processedtemplate = Handlebars.compile(data);
    const html = processedtemplate({products})
    tableProducts.innerHTML = html;
})

async function sendData(formData) {
    const data = await fetch('http://localhost:4000/api/products', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: "Romualdo"
        })
    })
    const resp = await data.json();
    clearInputs();
}

function validateInputs() {
    nameProduct.addEventListener('blur' , (e) => {
        if (!(e.target.value.length > 3)) {
            messageName.textContent =  'Ingrese nombre de producto valido';
            nameProduct.classList.add('border-2', 'border-red-500');
        }else{
            messageName.textContent =  ''
            nameProduct.classList.remove('border-2', 'border-red-500');
        }
    })
    priceProduct.addEventListener('blur' , (e) => {
        if (!(e.target.value > 0)) {
            messagePrecio.textContent =  'Ingrese un precio de producto valido'
            priceProduct.classList.add('border-2', 'border-red-500');
        }else{
            messagePrecio.textContent =  ''
            priceProduct.classList.remove('border-2', 'border-red-500');
        }
    })

    fileProduct.addEventListener('change' , (e) => {
        if (e.target.value) {
            document.querySelector('.text-file').textContent = e.target.files[0].name;
            document.querySelector('.text-file').parentElement.classList.remove('hover:bg-blue-500')
            document.querySelector('.text-file').parentElement.classList.add('bg-green-400')
        }
    })
}

function clearInputs () {
    document.querySelector('.name-product').value = "";
    document.querySelector('.price-product').value= "";
    document.querySelector('.file-product').value= "";
}

async function deleteProduct(idProduct) {
    const response = await fetch(`http://localhost:4000/api/products/${idProduct}`, {
        method: 'DELETE'
    });
    const result = await response.json();

    //Socket para emitir 
    socket.emit('deleteProduct', result);
}