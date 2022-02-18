const btnAddProduct = document.querySelector('.btn-add-product');
const nameProduct = document.querySelector('.name-product');
const priceProduct = document.querySelector('.price-product');
const fileProduct = document.querySelector('.file-product');

const messageName = document.querySelector('.message-error-name');
const messagePrecio = document.querySelector('.message-error-price');
const messageError = document.querySelector('.message-error');

validateInputs();
btnAddProduct.addEventListener('click', validateForm);

function validateForm() {
    if (!nameProduct.value.trim() || !priceProduct.value.trim() || !fileProduct.value) {
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
    formData.append('price', priceProduct.value)
    
    sendData(formData);
}

async function sendData(formData) {
    const data = await fetch('/api/products', {
        method:'POST',
        body: formData
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
            console.log("mrda")
        }
    })
}

function clearInputs () {
    document.querySelector('.name-product').value = "";
    document.querySelector('.price-product').value= "";
    document.querySelector('.file-product').value= "";
}